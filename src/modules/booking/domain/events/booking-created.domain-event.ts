import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class BookingCreatedDomainEvent extends DomainEvent {
  readonly bikeId: string;

  readonly customerId: string;

  readonly start: Date;

  readonly end: Date;

  readonly status: string;

  readonly totalPrice: number;

  constructor(props: DomainEventProps<BookingCreatedDomainEvent>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerId = props.customerId;
    this.start = props.start;
    this.end = props.end;
    this.status = props.status;
    this.totalPrice = props.totalPrice;
  }
}
