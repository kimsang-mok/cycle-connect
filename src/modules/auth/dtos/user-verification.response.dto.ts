import { ApiProperty } from '@nestjs/swagger';
import { ResponseBase } from '@src/libs/api/response.base';

export class UserVerificationResponseDto extends ResponseBase {
  @ApiProperty({
    example: '123456',
    description: 'Verification code',
  })
  code: string;

  @ApiProperty({
    example: true,
    description: 'Indicate whether the email/phone is verified',
  })
  verified: boolean;

  @ApiProperty({
    description: "Code's expiration",
  })
  expiresAt: Date;
}
