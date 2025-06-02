import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { BikeTypes } from '../../domain/bike.types';

export class FindBikesRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(BikeTypes)
  readonly type?: BikeTypes;

  @ApiProperty({
    example: 'Honda Wave',
  })
  @IsOptional()
  @IsString()
  readonly model?: string;

  @ApiProperty({
    example: 125,
  })
  @IsOptional()
  @IsNumber()
  readonly enginePower?: number;

  @ApiProperty({
    description: 'Lowest rental price',
  })
  @IsOptional()
  @IsNumber()
  readonly minPrice?: number;

  @ApiProperty({
    description: 'Highest rental price',
  })
  @IsOptional()
  @IsNumber()
  readonly maxPrice?: number;

  @ApiProperty({
    description: "Id of bike's owner",
  })
  @IsOptional()
  @IsUUID()
  readonly ownerId?: string;
}
