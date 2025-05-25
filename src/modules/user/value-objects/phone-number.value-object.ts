import { DomainPrimitive, ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export class PhoneNumber extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate(props: DomainPrimitive<string>): void {
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(props.value)) {
      throw new ArgumentInvalidException('Invalid phone number');
    }
  }
}
