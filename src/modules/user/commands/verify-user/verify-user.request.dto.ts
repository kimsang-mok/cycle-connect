import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class VerifyUserRequestDto {
  @ApiProperty({
    example: 123123,
    description: 'Verification code',
  })
  @MinLength(6)
  readonly code: string;
}
