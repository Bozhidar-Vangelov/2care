import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({
    description: 'The name of the family',
    example: 'Smith Family',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
