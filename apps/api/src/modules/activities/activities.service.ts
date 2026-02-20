import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import { ActivityType, FamilyRole } from '@/generated/prisma/client';
import type { Activity, PaginatedResponse } from '@2care/types';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { metadataSchema } from './activity-metadata.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesDto } from './dto/list-activities.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(
    createActivityDto: CreateActivityDto,
    userId: string,
  ): Promise<Activity> {
    const { babyId, type, timestamp, notes, metadata } = createActivityDto;

    const baby = await this.prisma.baby.findUnique({
      where: { id: babyId },
      include: {
        family: {
          include: { members: true },
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

    if (member.role === FamilyRole.VIEWER) {
      throw new ForbiddenException(
        'Only PRIMARY_PARENT, CO_PARENT, or CAREGIVER can log activities',
      );
    }

    const activity = await this.prisma.activity.create({
      data: {
        type,
        babyId,
        userId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        notes,
        metadata: metadata,
      },
    });

    return activity as Activity;
  }

  private validateMetadataForType(type: ActivityType, metadata: unknown): void {
    const schema = metadataSchema[type];
    const result = schema.safeParse(metadata);
    if (!result.success) {
      const message = result.error.errors
        .map((e) => `metadata.${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(
        `Invalid metadata for type ${type}: ${message}`,
      );
    }
  }

  async updateActivity(
    id: string,
    updateActivityDto: UpdateActivityDto,
    userId: string,
  ): Promise<Activity> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        baby: {
          include: {
            family: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.baby.deletedAt) {
      throw new NotFoundException('Baby not found');
    }

    if (activity.baby.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = activity.baby.family.members.find(
      (m) => m.userId === userId,
    );
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    const isCreator = activity.userId === userId;
    const canEdit =
      isCreator ||
      member.role === FamilyRole.PRIMARY_PARENT ||
      member.role === FamilyRole.CO_PARENT;

    if (!canEdit) {
      throw new ForbiddenException(
        'Only the activity creator, PRIMARY_PARENT, or CO_PARENT can update activities',
      );
    }

    const { type, timestamp, notes, metadata } = updateActivityDto;

    if (metadata !== undefined) {
      const effectiveType = type ?? activity.type;
      this.validateMetadataForType(effectiveType, metadata);
    }

    const updated = await this.prisma.activity.update({
      where: { id },
      data: {
        ...(type !== undefined ? { type } : {}),
        ...(timestamp !== undefined ? { timestamp: new Date(timestamp) } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
      },
    });

    return updated as Activity;
  }

  async getActivityById(id: string, userId: string): Promise<Activity> {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        baby: {
          include: {
            family: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.baby.deletedAt) {
      throw new NotFoundException('Baby not found');
    }

    if (activity.baby.family.deletedAt) {
      throw new NotFoundException('Family not found');
    }

    const member = activity.baby.family.members.find(
      (m) => m.userId === userId,
    );
    if (!member) {
      throw new ForbiddenException('You are not a member of this family');
    }

    return activity as Activity;
  }

  async listActivities(
    query: ListActivitiesDto,
    userId: string,
  ): Promise<PaginatedResponse<Activity>> {
    const { babyId, type, from, to, page = 1, pageSize = 20 } = query;

    const baby = await this.prisma.baby.findUnique({
      where: { id: babyId },
      include: {
        family: {
          include: { members: true },
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

    const where = {
      babyId,
      ...(type ? { type } : {}),
      ...(from || to
        ? {
            timestamp: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      this.prisma.activity.count({ where }),
      this.prisma.activity.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: data as Activity[],
      total,
    };
  }
}
