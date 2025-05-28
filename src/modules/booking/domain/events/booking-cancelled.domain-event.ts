import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class BookingCancelledDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerId: string;

  constructor(props: DomainEventProps<BookingCancelledDomainEvent>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerId = props.customerId;
  }
}
