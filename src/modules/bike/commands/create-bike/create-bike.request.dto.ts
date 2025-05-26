import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';

export class CreateBikeRequestDto {
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
