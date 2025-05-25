import { DomainEvent, DomainEventProps } from '@src/libs/ddd';
import { UserRoles } from '../user.types';
import { Email } from '../../value-objects/email.value-object';
import { PhoneNumber } from '../../value-objects/phone-number.value-object';
import { Password } from '../../value-objects/password.value-object';

export class UserCreatedDomainEvent extends DomainEvent {
  readonly email?: Email;

  readonly phone?: PhoneNumber;

  readonly password: Password;

  readonly role: UserRoles;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);
    this.email = props.email;
    this.phone = props.phone;
    this.password = props.password;
    this.role = props.role;
  }
}
