import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ActivityType, Prisma } from '@/generated/prisma/client';

export class CreateActivityDto {
  @ApiProperty({
    description: 'The ID of the baby this activity belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly babyId: string;

  @ApiProperty({
    description: 'The type of activity',
    enum: ActivityType,
    example: ActivityType.FEEDING,
  })
  @IsEnum(ActivityType)
  @IsNotEmpty()
  readonly type: ActivityType;

  @ApiPropertyOptional({
    description: 'Timestamp of the activity — defaults to now if omitted',
    example: '2026-02-20T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  readonly timestamp?: string;

  @ApiPropertyOptional({
    description: 'Optional free-text notes',
    example: 'Baby ate 120 ml of formula',
  })
  @IsString()
  @IsOptional()
  readonly notes?: string;

  @ApiPropertyOptional({
    description: 'Activity-specific structured metadata',
    example: { amount: 120, unit: 'ml', feedType: 'formula' },
  })
  @IsObject()
  @IsOptional()
  readonly metadata?: Prisma.InputJsonValue;
}
