import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityType } from '@/generated/prisma/client';
import type { Prisma } from '@/generated/prisma/client';

export class UpdateActivityDto {
  @ApiPropertyOptional({
    description: 'The type of activity',
    enum: ActivityType,
    example: ActivityType.FEEDING,
  })
  @IsEnum(ActivityType)
  @IsOptional()
  readonly type?: ActivityType;

  @ApiPropertyOptional({
    description: 'Timestamp of the activity',
    example: '2026-02-20T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  readonly timestamp?: string;

  @ApiPropertyOptional({
    description: 'Optional free-text notes',
    example: 'Updated note',
  })
  @IsString()
  @IsOptional()
  readonly notes?: string;

  @ApiPropertyOptional({
    description:
      'Activity-specific structured metadata (validated against type)',
    example: { amount: 120, unit: 'ml', feedType: 'formula' },
  })
  @IsObject()
  @IsOptional()
  readonly metadata?: Prisma.InputJsonValue;
}
