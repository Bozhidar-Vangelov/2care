import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ActivityType } from '@/generated/prisma/client';

export class ListActivitiesDto {
  @ApiProperty({
    description: 'ID of the baby whose activities to fetch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly babyId: string;

  @ApiPropertyOptional({
    description: 'Filter by a specific activity type',
    enum: ActivityType,
  })
  @IsEnum(ActivityType)
  @IsOptional()
  readonly type?: ActivityType;

  @ApiPropertyOptional({
    description: 'Return activities on or after this timestamp (ISO 8601)',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  readonly from?: string;

  @ApiPropertyOptional({
    description: 'Return activities on or before this timestamp (ISO 8601)',
    example: '2026-02-20T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  readonly to?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly pageSize?: number = 20;
}
