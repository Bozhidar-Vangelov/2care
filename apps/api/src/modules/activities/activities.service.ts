import { PrismaService } from '@/core/infrastructure/database/prisma/prisma.service';
import { FamilyRole } from '@/generated/prisma/client';
import type { Activity, PaginatedResponse } from '@2care/types';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesDto } from './dto/list-activities.dto';

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
