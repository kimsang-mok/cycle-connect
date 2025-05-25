import { DomainEvent, DomainEventProps } from '@src/libs/ddd';

export class UserVerificationCreatedDomainEvent extends DomainEvent {
  readonly expiresAt: Date;

  readonly code: string;

  readonly userId: string;

  readonly verified: boolean;

  constructor(props: DomainEventProps<UserVerificationCreatedDomainEvent>) {
    super(props);
    this.expiresAt = props.expiresAt;
    this.code = props.code;
    this.userId = props.userId;
    this.verified = props.verified;
  }
}
