import { SqlRepositoryBase } from '@src/libs/db/sql-repository.base';
import { BookingEntity } from '../../domain/booking.entity';
import { BookingRepositoryPort } from '../ports/booking.repository.port';
import { BookingModel, bookingSchema } from '../booking.schema';
import { InjectPool } from 'nestjs-slonik';
import { DatabasePool, sql } from 'slonik';
import { BookingMapper } from '@src/modules/booking/booking.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { BookingStatus } from '../../domain/booking.types';

export class BookingRepository
  extends SqlRepositoryBase<BookingEntity, BookingModel>
  implements BookingRepositoryPort
{
  protected tableName = 'bookings';

  protected schema = bookingSchema;

  constructor(
    @InjectPool()
    pool: DatabasePool,
    mapper: BookingMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(BookingRepository.name));
  }

  async findConfirmedOrPendingByBikeId(
    bikeId: string,
  ): Promise<BookingEntity[]> {
    const statuses = [BookingStatus.pendingPayment, BookingStatus.confirmed];

    const query = sql.type(this.schema)`
    SELECT * FROM ${sql.identifier([this.tableName])}
    WHERE "bikeId" = ${bikeId}
      AND status = ANY(${sql.array(statuses, 'text')})
  `;

    const result = await this.pool.query(query);
    return result.rows.map(this.mapper.toDomain);
  }
}
