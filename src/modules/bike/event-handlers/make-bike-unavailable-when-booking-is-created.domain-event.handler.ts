import { Inject, Injectable } from '@nestjs/common';
import { BikeRepositoryPort } from '../database/ports/bike.repository.port';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingCreatedDomainEvent } from '@src/modules/booking/domain/events/booking-created.domain-event';
import { BIKE_REPOSITORY } from '../bike.di-tokens';
import { NotFoundException } from '@src/libs/exceptions';

@Injectable()
export class MakeBikeUnavailableWhenBookingIsCreated {
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected readonly bikeRepo: BikeRepositoryPort,
  ) {}

  @OnEvent(BookingCreatedDomainEvent.name, { suppressErrors: false })
  async handle(event: BookingCreatedDomainEvent) {
    const bike = await this.bikeRepo.findOneById(event.bikeId);

    if (!bike) {
      throw new NotFoundException();
    }

    bike.deactivate();

    this.bikeRepo.save(bike);
  }
}
