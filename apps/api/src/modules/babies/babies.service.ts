import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import { FamilyRole } from '@/generated/prisma/client';
import type { Baby } from '@2care/types';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@Injectable()
export class BabiesService {
  constructor(private prisma: PrismaService) {}

  async createBaby(
    createBabyDto: CreateBabyDto,
    userId: string,
  ): Promise<Baby> {
    const { familyId, name, dateOfBirth, gender, photoUrl } = createBabyDto;

    // Verify user is a member of the family
    const familyMember = await this.prisma.familyMember.findFirst({
      where: {
        familyId,
        userId,
      },
      include: {
        family: true,
      },
    });

    if (!familyMember) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (familyMember.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    // Only PRIMARY_PARENT and CO_PARENT can add babies
    if (
      familyMember.role !== FamilyRole.PRIMARY_PARENT &&
      familyMember.role !== FamilyRole.CO_PARENT
    ) {
      throw new ForbiddenException(
        'Only PRIMARY_PARENT or CO_PARENT can add babies',
      );
    }

    const baby = await this.prisma.baby.create({
      data: {
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        photoUrl,
        familyId,
      },
    });

    return baby;
  }

  async getUserBabies(userId: string): Promise<Baby[]> {
    // Get all families the user is a member of
    const familyMembers = await this.prisma.familyMember.findMany({
      where: {
        userId,
        family: {
          deletedAt: null,
        },
      },
      select: {
        familyId: true,
      },
    });

    const familyIds = familyMembers.map((fm) => fm.familyId);

    // Get all babies from those families
    const babies = await this.prisma.baby.findMany({
      where: {
        familyId: {
          in: familyIds,
        },
        deletedAt: null,
      },
      orderBy: {
        dateOfBirth: 'desc',
      },
    });

    return babies;
  }

  async getBabyById(id: string, userId: string): Promise<Baby> {
    const baby = await this.prisma.baby.findUnique({
      where: { id },
    });

    if (!baby || baby.deletedAt) {
      throw new NotFoundException('Baby not found');
    }

    // Verify user is a member of the family
    const familyMember = await this.prisma.familyMember.findFirst({
      where: {
        familyId: baby.familyId,
        userId,
      },
      include: {
        family: true,
      },
    });

    if (!familyMember) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (familyMember.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    return baby;
  }

  async updateBaby(
    id: string,
    updateBabyDto: UpdateBabyDto,
    userId: string,
  ): Promise<Baby> {
    const baby = await this.prisma.baby.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!baby || baby.deletedAt) {
      throw new NotFoundException('Baby not found');
    }

    if (baby.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = baby.family.members.find((m) => m.userId === userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (
      member.role !== FamilyRole.PRIMARY_PARENT &&
      member.role !== FamilyRole.CO_PARENT
    ) {
      throw new ForbiddenException(
        'Only PRIMARY_PARENT or CO_PARENT can update baby information',
      );
    }

    const updatedBaby = await this.prisma.baby.update({
      where: { id },
      data: {
        ...updateBabyDto,
        dateOfBirth: updateBabyDto.dateOfBirth
          ? new Date(updateBabyDto.dateOfBirth)
          : undefined,
      },
    });

    return updatedBaby;
  }

  async softDeleteBaby(id: string, userId: string): Promise<void> {
    const baby = await this.prisma.baby.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!baby || baby.deletedAt) {
      throw new NotFoundException('Baby not found');
    }

    if (baby.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = baby.family.members.find((m) => m.userId === userId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    if (member.role !== FamilyRole.PRIMARY_PARENT) {
      throw new ForbiddenException('Only PRIMARY_PARENT can delete a baby');
    }

    await this.prisma.baby.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
