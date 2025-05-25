import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class UserVerifiedDomainEvent extends DomainEvent {
  readonly userId: string;

  constructor(props: DomainEventProps<UserVerifiedDomainEvent>) {
    super(props);
    this.userId = props.userId;
  }
}
