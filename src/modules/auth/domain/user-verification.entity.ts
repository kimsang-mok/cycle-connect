import { AggregateRoot } from '@src/libs/ddd';
import { AggregateId } from '@src/libs/ddd';
import { randomUUID } from 'crypto';
import { UserVerificationCreatedDomainEvent } from './events/user-verification-created.domain-event';
import {
  CreateUserVerificationProps,
  UserVerificationProps,
} from './auth.types';
import * as ms from 'ms';
import { authConfig } from '@src/configs/auth.config';
import { UserVerifiedDomainEvent } from './events/user-verified.domain-event';
import {
  UserAlreadyVerifiedError,
  UserVerificationCodeExpiredError,
  UserVerificationMismatchError,
} from '../auth.errors';

export class UserVerificationEntity extends AggregateRoot<UserVerificationProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateUserVerificationProps): UserVerificationEntity {
    // const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins
    const expiresAt = new Date(
      Date.now() + ms(authConfig.confirmEmailExpires as any),
    );

    const id = randomUUID();
    const props: UserVerificationProps = {
      ...create,
      expiresAt,
      verified: false,
    };

    const verification = new UserVerificationEntity({
      id,
      props,
    });

    verification.addEvent(
      new UserVerificationCreatedDomainEvent({
        aggregateId: id,
        expiresAt: props.expiresAt,
        target: props.target,
        token: props.token,
        userId: props.userId,
        verified: props.verified,
      }),
    );

    return verification;
  }

  verify(userId: string): void {
    if (this.props.verified) throw new UserAlreadyVerifiedError();
    if (this.props.userId !== userId) throw new UserVerificationMismatchError();
    if (new Date() > this.props.expiresAt)
      throw new UserVerificationCodeExpiredError();

    this.addEvent(
      new UserVerifiedDomainEvent({
        aggregateId: this.id,
        userId,
      }),
    );

    this.props.verified = true;
  }

  public validate(): void {}
}
