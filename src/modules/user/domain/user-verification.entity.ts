import { AggregateRoot } from '@src/libs/ddd';
import { AggregateId } from '@src/libs/ddd';
import { UserVerificationProps } from './user.types';
import { randomUUID } from 'crypto';
import { UserVerificationCreatedDomainEvent } from './events/user-verification-created.domain-event';

export class UserVerificationEntity extends AggregateRoot<UserVerificationProps> {
  protected readonly _id: AggregateId;

  static create(userId: AggregateId): UserVerificationEntity {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins
    console.log('User Id:', userId);

    const id = randomUUID();
    const props: UserVerificationProps = {
      expiresAt,
      code,
      userId,
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
        code: props.code,
        userId: props.userId,
        verified: props.verified,
      }),
    );

    return verification;
  }

  verify(inputCode: string): void {
    if (this.props.verified) throw new Error('Already verified');
    if (this.props.code !== inputCode) throw new Error('Invalid code');
    if (new Date() > this.props.expiresAt) throw new Error('Code expired');

    this.props.verified = true;
  }

  public validate(): void {}
}
