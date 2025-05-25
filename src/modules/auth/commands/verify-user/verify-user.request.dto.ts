import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserRequestDto {
  @ApiProperty({
    example: '123456',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
