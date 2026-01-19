import { FamilyRole } from '@/generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({
    description: 'Role for the invited member',
    enum: FamilyRole,
    default: FamilyRole.VIEWER,
    required: false,
  })
  @IsEnum(FamilyRole)
  @IsOptional()
  role?: FamilyRole;

  @ApiProperty({
    description: 'Expiration time in hours (default: 168 hours / 7 days)',
    default: 168,
    minimum: 1,
    maximum: 720,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(720)
  @IsOptional()
  expiresInHours?: number;
}
