import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class UserVerificationCreatedDomainEvent extends DomainEvent {
  readonly expiresAt: Date;

  readonly target: string;

  readonly token: string;

  readonly userId: string;

  readonly verified: boolean;

  constructor(props: DomainEventProps<UserVerificationCreatedDomainEvent>) {
    super(props);
    this.expiresAt = props.expiresAt;
    this.target = props.target;
    this.token = props.token;
    this.userId = props.userId;
    this.verified = props.verified;
  }
}
