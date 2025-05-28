import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingMapper } from './booking.mapper';
import { BOOKING_REPOSITORY } from './booking.di-tokens';
import { BookingRepository } from './database/adapters/booking.repository';
import { CreateBookingService } from './commands/create-booking/create-booking.service';
import { CreateBookingController } from './commands/create-booking/create-booking.controller';
import { BikeModule } from '../bike/bike.module';
import { BookingAvailabityService } from './domain/services/booking-availability.service';
import { BookingPricingServie } from './domain/services/booking-pricing.sevice';

const controllers = [CreateBookingController];

const commandHandlers: Provider[] = [CreateBookingService];

const queryHandlers: Provider[] = [];

const mappers: Provider[] = [BookingMapper];

const repositories: Provider[] = [
  {
    provide: BOOKING_REPOSITORY,
    useClass: BookingRepository,
  },
];

@Module({
  imports: [CqrsModule, BikeModule],
  controllers: [...controllers],
  providers: [
    Logger,
    BookingAvailabityService,
    BookingPricingServie,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...mappers,
  ],
})
export class BookingModule {}
