import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from '@/generated/prisma/client';

export class CreateBabyDto {
  @ApiProperty({
    description: 'The name of the baby',
    example: 'Emma',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The date of birth of the baby',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  readonly dateOfBirth: string;

  @ApiProperty({
    description: 'The gender of the baby',
    enum: Gender,
    required: false,
    example: Gender.FEMALE,
  })
  @IsEnum(Gender)
  @IsOptional()
  readonly gender?: Gender;

  @ApiProperty({
    description: 'The family ID the baby belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly familyId: string;

  @ApiProperty({
    description: 'The photo URL of the baby',
    required: false,
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsOptional()
  readonly photoUrl?: string;
}
