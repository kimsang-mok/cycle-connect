import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PresignedUrlRequestDto {
  @ApiProperty({ example: 'example.jpg' })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsNotEmpty()
  @IsString()
  mimetype: string;
}
