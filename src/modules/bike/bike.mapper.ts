import { Mapper } from '@src/libs/ddd';
import { BikeModel, bikeSchema } from './database/bike.schema';
import { BikeEntity } from './domain/bike.entity';
import { BikeResponseDto } from './dtos/bike.response.dto';
import { Injectable } from '@nestjs/common';
import { Price } from './domain/value-objects/price.value-object';

@Injectable()
export class BikeMapper
  implements Mapper<BikeEntity, BikeModel, BikeResponseDto>
{
  toPersistence(entity: BikeEntity): BikeModel {
    const copy = entity.getProps();
    const record: BikeModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      ownerId: copy.ownerId,
      type: copy.type,
      model: copy.model,
      enginePower: copy.enginePower,
      pricePerDay: copy.pricePerDay.unpack(),
      description: copy.description,
      isActive: copy.isActive,
    };
    return bikeSchema.parse(record);
  }

  toDomain(record: BikeModel): BikeEntity {
    const entity = new BikeEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        ownerId: record.ownerId,
        type: record.type,
        model: record.model,
        enginePower: record.enginePower,
        pricePerDay: new Price(record.pricePerDay),
        description: record.description,
        isActive: record.isActive,
      },
    });
    return entity;
  }

  toResponse(entity: BikeEntity): BikeResponseDto {
    const props = entity.getProps();
    const response = new BikeResponseDto(props);
    response.ownerId = props.ownerId;
    response.type = props.type;
    response.model = props.model;
    response.enginePower = props.enginePower;
    response.pricePerDay = props.pricePerDay.unpack();
    response.description = props.description;
    response.isActive = props.isActive;
    return response;
  }
}
