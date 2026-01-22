import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import { FamilyRole } from '@/generated/prisma/client';
import type { Family } from '@2care/types';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { JoinFamilyDto } from './dto/join-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async createFamily(
    createFamilyDto: CreateFamilyDto,
    userId: string,
  ): Promise<Family> {
    const { name } = createFamilyDto;

    const family = await this.prisma.family.create({
      data: {
        name,
        members: {
          create: {
            userId,
            role: FamilyRole.PRIMARY_PARENT,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              omit: { password: true },
            },
          },
        },
      },
    });

    return family;
  }

  async getUserFamilies(userId: string): Promise<Family[]> {
    const families = await this.prisma.family.findMany({
      where: {
        deletedAt: null,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              omit: { password: true },
            },
          },
        },
      },
    });

    return families;
  }

  async getFamilyById(id: string, userId: string): Promise<Family> {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              omit: { password: true },
            },
          },
        },
        babies: true,
      },
    });

    if (!family || family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const isMember = family.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this family');
    }

    return family;
  }

  async updateFamily(
    id: string,
    updateFamilyDto: UpdateFamilyDto,
    userId: string,
  ): Promise<Family> {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!family || family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = family.members.find((m) => m.userId === userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (
      member.role !== FamilyRole.PRIMARY_PARENT &&
      member.role !== FamilyRole.CO_PARENT
    ) {
      throw new ForbiddenException(
        'Only PRIMARY_PARENT or CO_PARENT can update the family',
      );
    }

    const updatedFamily = await this.prisma.family.update({
      where: { id },
      data: updateFamilyDto,
      include: {
        members: {
          include: {
            user: {
              omit: { password: true },
            },
          },
        },
        babies: true,
      },
    });

    return updatedFamily;
  }

  async softDeleteFamily(id: string, userId: string): Promise<void> {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!family || family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = family.members.find((m) => m.userId === userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (member.role !== FamilyRole.PRIMARY_PARENT) {
      throw new ForbiddenException('Only PRIMARY_PARENT can delete the family');
    }

    await this.prisma.family.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async generateInviteLink(
    familyId: string,
    createInviteDto: CreateInviteDto,
    userId: string,
  ): Promise<{ inviteLink: string; token: string; expiresAt: Date }> {
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      include: { members: true },
    });

    if (!family || family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = family.members.find((m) => m.userId === userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (
      member.role !== FamilyRole.PRIMARY_PARENT &&
      member.role !== FamilyRole.CO_PARENT
    ) {
      throw new ForbiddenException(
        'Only PRIMARY_PARENT or CO_PARENT can create invites',
      );
    }

    const expiresInHours = createInviteDto.expiresInHours || 168;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const invite = await this.prisma.familyInvite.create({
      data: {
        familyId,
        role: createInviteDto.role || FamilyRole.VIEWER,
        expiresAt,
        createdBy: userId,
      },
    });

    //TODO: Replace with frontend URL from config
    const inviteLink = `http://localhost:3000/families/join/${invite.token}`;

    return {
      inviteLink,
      token: invite.token,
      expiresAt: invite.expiresAt,
    };
  }

  async joinFamily(
    joinFamilyDto: JoinFamilyDto,
    userId: string,
  ): Promise<Family> {
    const { token } = joinFamilyDto;

    const invite = await this.prisma.familyInvite.findUnique({
      where: { token },
      include: {
        family: {
          include: {
            members: {
              include: {
                user: {
                  omit: { password: true },
                },
              },
            },
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invalid invite token');
    }

    if (invite.usedAt) {
      throw new BadRequestException('This invite has already been used');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('This invite has expired');
    }

    if (!invite.family || invite.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const isAlreadyMember = invite.family.members.some(
      (member) => member.userId === userId,
    );
    if (isAlreadyMember) {
      throw new ConflictException('You are already a member of this family');
    }

    // Add user to family and mark invite as used
    const [familyMember] = await this.prisma.$transaction([
      this.prisma.familyMember.create({
        data: {
          userId,
          familyId: invite.familyId,
          role: invite.role,
        },
        include: {
          family: {
            include: {
              members: {
                include: {
                  user: {
                    omit: { password: true },
                  },
                },
              },
              babies: true,
            },
          },
        },
      }),
      this.prisma.familyInvite.update({
        where: { id: invite.id },
        data: {
          usedAt: new Date(),
          usedBy: userId,
        },
      }),
    ]);

    return familyMember.family;
  }
}
