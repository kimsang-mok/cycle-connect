import { Inject, Injectable } from '@nestjs/common';
import { BikeRepositoryPort } from '../database/ports/bike.repository.port';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingCreatedDomainEvent } from '@src/modules/booking/domain/events/booking-created.domain-event';
import { BIKE_REPOSITORY } from '../bike.di-tokens';

@Injectable()
export class MakeBikeUnavailableWhenBookingIsCreated {
  constructor(
    @Inject(BIKE_REPOSITORY)
    protected readonly bikeRepo: BikeRepositoryPort,
  ) {}

  @OnEvent(BookingCreatedDomainEvent.name, { suppressErrors: false })
  async handle(event: BookingCreatedDomainEvent) {
    const bike = (await this.bikeRepo.findOneById(event.bikeId)).unwrap();

    bike.deactivate();

    this.bikeRepo.save(bike);
  }
}
