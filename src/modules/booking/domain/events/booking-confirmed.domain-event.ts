import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class BookingConfirmedDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerId: string;

  constructor(props: DomainEventProps<BookingConfirmedDomainEvent>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerId = props.customerId;
  }
}
