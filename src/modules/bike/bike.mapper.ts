import { Mapper } from '@src/libs/ddd';
import { BikeModel, bikeSchema } from './database/bike.schema';
import { BikeEntity } from './domain/bike.entity';
import { BikeResponseDto } from './dtos/bike.response.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Price } from './domain/value-objects/price.value-object';
import { FILE_URL_RESOLVER } from '../file/file.di-tokens';
import { FileUrlResolverPort } from '../file/uploader/ports/file-url-resolver.port';

@Injectable()
export class BikeMapper
  implements Mapper<BikeEntity, BikeModel, BikeResponseDto>
{
  constructor(
    @Inject(FILE_URL_RESOLVER)
    protected readonly fileUrlResolver: FileUrlResolverPort,
  ) {}

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
      photoKeys: copy.photoKeys,
      thumbnailKey: copy.thumbnailKey,
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
        photoKeys: record.photoKeys,
        thumbnailKey: record.thumbnailKey,
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
    // response.photoKeys = props.photoKeys;
    // response.thumbnailKey = props.thumbnailKey;
    response.photoUrls = props.photoKeys.map((key) =>
      this.fileUrlResolver.resolveUrl(key),
    );
    response.thumbnailUrl = this.fileUrlResolver.resolveUrl(props.thumbnailKey);
    return response;
  }
}
