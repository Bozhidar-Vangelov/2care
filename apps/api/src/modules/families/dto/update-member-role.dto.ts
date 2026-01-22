import { FamilyRole } from '@/generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the family member',
    enum: FamilyRole,
    example: FamilyRole.CO_PARENT,
  })
  @IsEnum(FamilyRole)
  role: FamilyRole;
}
