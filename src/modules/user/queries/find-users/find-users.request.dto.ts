import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail } from 'class-validator';

export class FindUsersRequestDto {
  @ApiProperty({ example: 'test@example.com', description: "User's email" })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
