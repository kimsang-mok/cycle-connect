import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserRequestDto {
  @ApiProperty({
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'test1@example.com',
  })
  @IsString()
  @IsNotEmpty()
  target: string;
}
