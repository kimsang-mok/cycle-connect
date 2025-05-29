import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../../domain/user.types';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'User email address (optional if phone is provided)',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  readonly password: string;

  @ApiProperty({
    example: UserRoles.customer,
    enum: UserRoles,
    description: 'User role',
  })
  @IsEnum(UserRoles)
  readonly role: UserRoles;
}
