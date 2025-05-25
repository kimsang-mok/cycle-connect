import { AggregateId, AggregateRoot } from '@src/libs/ddd';

import { CreateUserProps, UserRoles, UserProps } from './user.types';
import { randomUUID } from 'crypto';
import { UserCreatedDomainEvent } from './events/user-created.domain-event';

import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
} from '@src/libs/exceptions';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateId;

  static create(create: CreateUserProps) {
    const id = randomUUID();
    const props: UserProps = { ...create };
    const user = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
        phone: props.phone,
        password: props.password,
        role: props.role,
      }),
    );
    return user;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */
  get role(): UserRoles {
    return this.props.role;
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
    if (!this.props.password) {
      throw new ArgumentNotProvidedException('Password must be provided');
    }

    if (!this.props.email && !this.props.phone) {
      throw new ArgumentNotProvidedException(
        'At least one of email or phone must be provided',
      );
    }

    if (!Object.values(UserRoles).includes(this.props.role)) {
      throw new ArgumentInvalidException('Invalid user role');
    }
  }
}
