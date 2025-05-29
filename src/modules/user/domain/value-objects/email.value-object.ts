import { DomainPrimitive, ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export class Email extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate(props: DomainPrimitive<string>): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(props.value)) {
      throw new ArgumentInvalidException('Invalid email format');
    }
  }
}
