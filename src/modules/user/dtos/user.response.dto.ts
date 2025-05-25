import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseBase } from '@libs/api/response.base';

export class UserResponseDto extends ResponseBase {
  @ApiPropertyOptional({
    example: 'john-doe@gmail.com',
    description: "User's email address",
  })
  email?: string | null;

  @ApiPropertyOptional({
    example: '8551234567',
    description: "User's phone number",
    nullable: true,
  })
  phone?: string | null;
}
