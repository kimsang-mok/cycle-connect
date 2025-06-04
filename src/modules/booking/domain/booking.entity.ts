import { AggregateRoot } from '@src/libs/ddd';
import {
  BookingProps,
  BookingStatus,
  CreateBookingProps,
} from './booking.types';
import { AggregateId } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { BookingCreatedDomainEvent } from './events/booking-created.domain-event';
import { BookingConfirmedDomainEvent } from './events/booking-confirmed.domain-event';
import { BookingCancelledDomainEvent } from './events/booking-cancelled.domain-event';
import { BookingCompletedDomainEvent } from './events/booking-completed.domain-event';
import {
  CannotCancelBookingError,
  CannotCompleteUnconfirmedBookingError,
} from '../booking.errors';

export class BookingEntity extends AggregateRoot<BookingProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateBookingProps) {
    const id = randomUUID();

    const props: BookingProps = {
      ...create,
      status: BookingStatus.pendingPayment,
    };

    const booking = new BookingEntity({ id, props });

    booking.addEvent(
      new BookingCreatedDomainEvent({
        aggregateId: id,
        bikeId: props.bikeId,
        customerId: props.customerId,
        totalPrice: props.totalPrice.unpack(),
        start: props.period.start,
        end: props.period.end,
        status: props.status,
      }),
    );

    return booking;
  }

  confirm(): void {
    this.props.status = BookingStatus.confirmed;
    this.addEvent(
      new BookingConfirmedDomainEvent({
        aggregateId: this.id,
        bikeId: this.props.bikeId,
        customerId: this.props.customerId,
      }),
    );
  }

  cancel(): void {
    if (
      this.props.status === BookingStatus.cancelled ||
      this.props.status === BookingStatus.completed
    ) {
      throw new CannotCancelBookingError();
    }

    this.props.status = BookingStatus.cancelled;
    this.addEvent(
      new BookingCancelledDomainEvent({
        aggregateId: this.id,
        bikeId: this.props.bikeId,
        customerId: this.props.customerId,
      }),
    );
  }

  complete(): void {
    if (this.props.status !== BookingStatus.confirmed) {
      throw new CannotCompleteUnconfirmedBookingError();
    }
    this.props.status = BookingStatus.completed;
    this.addEvent(
      new BookingCompletedDomainEvent({
        aggregateId: this.id,
        bikeId: this.props.bikeId,
        customerId: this.props.customerId,
      }),
    );
  }

  public validate(): void {}
}
