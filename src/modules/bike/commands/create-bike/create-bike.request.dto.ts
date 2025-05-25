import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';

export class CreateBikeRequestDto {
  @ApiProperty({
    format: 'uuid',
    example: 'dcd93720-29a6-4937-b7a9-001a0f6c6d3f',
  })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ enum: BikeTypes, example: BikeTypes.motorbike })
  @IsEnum(BikeTypes)
  type: BikeTypes;

  @ApiProperty({ example: 'Honda Wave' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 125,
    description: 'Engine CC or gear count for bicycle',
  })
  @IsNumber()
  enginePower: number;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: 'Lightweight, fuel efficient motorbike.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
