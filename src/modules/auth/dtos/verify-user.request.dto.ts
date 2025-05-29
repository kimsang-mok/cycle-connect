import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserRequestDto {
  @ApiProperty({
    description: 'Hashed token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'test1@example.com',
  })
  @IsString()
  @IsNotEmpty()
  target: string;
}
