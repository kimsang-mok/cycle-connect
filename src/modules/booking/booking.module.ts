import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingMapper } from './booking.mapper';
import { BOOKING_REPOSITORY } from './booking.di-tokens';
import { BookingRepository } from './database/adapters/booking.repository';

const controllers = [];

const commandHandlers: Provider[] = [];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [BookingMapper];

const repositories: Provider[] = [
  {
    provide: BOOKING_REPOSITORY,
    useClass: BookingRepository,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [
    Logger,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class BookingModule {}
