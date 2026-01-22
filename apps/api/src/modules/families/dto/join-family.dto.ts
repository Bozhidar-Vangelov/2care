import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinFamilyDto {
  @ApiProperty({
    description: 'Family invite token',
    example: 'abc-123-uuid-token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
