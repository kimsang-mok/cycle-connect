import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from './create-booking.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { BOOKING_REPOSITORY } from '../../booking.di-tokens';
import { BookingRepositoryPort } from '../../database/ports/booking.repository.port';
import { BookingAvailabityService } from '../../domain/services/booking-availability.service';
import { RentalPeriod } from '@src/modules/bike/domain/value-objects/rental-period.value-object';
import { BookingPricingServie } from '../../domain/services/booking-pricing.sevice';
import { BikeRepositoryPort } from '@src/modules/bike/database/ports/bike.repository.port';
import { AggregateId } from '@src/libs/ddd';
import { BookingEntity } from '../../domain/booking.entity';
import { BIKE_REPOSITORY } from '@src/modules/bike/bike.di-tokens';

@CommandHandler(CreateBookingCommand)
export class CreateBookingService
  implements ICommandHandler<CreateBookingCommand, AggregateId>
{
  constructor(
    @Inject(BOOKING_REPOSITORY)
    protected readonly bookingRepo: BookingRepositoryPort,
    @Inject(BIKE_REPOSITORY)
    protected readonly bikeRepo: BikeRepositoryPort,
    protected readonly availabilityService: BookingAvailabityService,
    protected readonly pricingService: BookingPricingServie,
  ) {}

  async execute(command: CreateBookingCommand): Promise<AggregateId> {
    const period = new RentalPeriod({
      start: new Date(command.startDate),
      end: new Date(command.endDate),
    });

    const isBikeAvailable = await this.availabilityService.isBikeAvailable(
      command.bikeId,
      period,
    );

    if (!isBikeAvailable) {
      throw new Error('Bike is not available at this moment');
    }

    const bike = await this.bikeRepo.findOneById(command.bikeId);

    if (!bike) {
      throw new NotFoundException();
    }

    if (!bike.getProps().isActive) {
      throw new Error('Bike is unavailable right now');
    }

    const totalPrice = this.pricingService.calculateTotalPrice(
      bike.getProps().pricePerDay,
      period,
    );

    const booking = BookingEntity.create({
      bikeId: command.bikeId,
      customerId: command.customerId,
      period,
      totalPrice,
    });

    return this.bookingRepo.transaction(async () => {
      await this.bookingRepo.insert(booking);
      return booking.id;
    });
  }
}
