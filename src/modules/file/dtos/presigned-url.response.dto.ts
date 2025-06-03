import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlResponseDto {
  @ApiProperty({
    example: 'uploads/user-123/1717265567-abc123.jpg',
  })
  key: string;

  @ApiProperty({
    example:
      'https://bucket.s3.amazonaws.com/uploads/user-123/1717265567-abc123.jpg?...signature',
  })
  url: string;
}
