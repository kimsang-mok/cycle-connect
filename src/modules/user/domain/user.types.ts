import { Email } from './value-objects/email.value-object';
import { Password } from './value-objects/password.value-object';

export interface UserProps {
  email: Email;
  password: Password;
  role: UserRoles;
}

export interface CreateUserProps {
  email: Email;
  password: Password;
  role: UserRoles;
}

export enum UserRoles {
  admin = 'admin',
  renter = 'renter',
  customer = 'customer',
}
