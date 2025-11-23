import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user (min 8 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(8)
  readonly password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly lastName?: string;
}
