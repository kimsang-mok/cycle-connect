import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class BookingCompletedDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerId: string;

  constructor(props: DomainEventProps<BookingCompletedDomainEvent>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerId = props.customerId;
  }
}
