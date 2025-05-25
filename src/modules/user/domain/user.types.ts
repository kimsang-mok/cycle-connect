import { AggregateId } from '@src/libs/ddd';
import { Email } from '../value-objects/email.value-object';
import { Password } from '../value-objects/password.value-object';
import { PhoneNumber } from '../value-objects/phone-number.value-object';

export interface UserProps {
  email?: Email;
  phone?: PhoneNumber;
  password: Password;
  role: UserRoles;
}

export interface CreateUserProps {
  email?: Email;
  phone?: PhoneNumber;
  password: Password;
  role: UserRoles;
}

export enum UserRoles {
  admin = 'admin',
  renter = 'renter',
  customer = 'customer',
}

export interface UserVerificationProps {
  userId: AggregateId;
  target: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
}
