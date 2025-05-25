import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../../domain/user.types';

export class CreateUserRequestDto {
  @ApiPropertyOptional({
    example: 'john@gmail.com',
    description: 'User email address (optional if phone is provided)',
  })
  @IsOptional()
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({
    example: '+85512345678',
    description: 'User phone number (optional if email is provided)',
  })
  @IsOptional()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
  readonly phone?: string;

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
