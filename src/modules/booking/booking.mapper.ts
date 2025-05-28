import { Injectable } from '@nestjs/common';
import { Mapper } from '@src/libs/ddd';
import { BookingEntity } from './domain/booking.entity';
import { BookingModel, bookingSchema } from './database/booking.schema';
import { BookingResponseDto } from './dtos/booking.response.dto';
import { RentalPeriod } from '../bike/domain/value-objects/rental-period.value-object';
import { Price } from '../bike/domain/value-objects/price.value-object';

@Injectable()
export class BookingMapper
  implements Mapper<BookingEntity, BookingModel, BookingResponseDto>
{
  toPersistence(entity: BookingEntity): BookingModel {
    const copy = entity.getProps();
    const record: BookingModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      bikeId: copy.bikeId,
      customerId: copy.customerId,
      startDate: copy.period.start,
      endDate: copy.period.end,
      totalPrice: copy.totalPrice.unpack(),
      status: copy.status,
    };
    return bookingSchema.parse(record);
  }

  toDomain(record: BookingModel): BookingEntity {
    const entity = new BookingEntity({
      id: record.id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        bikeId: record.bikeId,
        customerId: record.customerId,
        period: new RentalPeriod({
          start: record.startDate,
          end: record.endDate,
        }),
        totalPrice: new Price(record.totalPrice),
        status: record.status,
      },
    });
    return entity;
  }

  toResponse(entity: BookingEntity): BookingResponseDto {
    const props = entity.getProps();
    const response = new BookingResponseDto(props);
    response.bikeId = props.bikeId;
    response.customerId = props.customerId;
    response.startDate = props.period.start;
    response.endDate = props.period.end;
    response.totalPrice = props.totalPrice.unpack();
    response.status = props.status;
    return response;
  }
}
