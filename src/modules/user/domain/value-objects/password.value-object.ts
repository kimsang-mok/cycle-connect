import { DomainPrimitive, ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';
import * as bcrypt from 'bcryptjs';

const MIN_LENGTH = 6;

export class Password extends ValueObject<string> {
  private constructor(props: DomainPrimitive<string>) {
    super(props);
  }

  // create a new password and hash it before storing
  static async create(plain: string): Promise<Password> {
    Password.ensureStrong(plain);
    const hash = await bcrypt.hash(plain, 10);
    return new Password({ value: hash });
  }

  static fromHashed(hashed: string): Password {
    return new Password({ value: hashed });
  }

  get value(): string {
    return this.props.value;
  }

  // compare hashed password with a plain text
  async compare(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.props.value);
  }

  protected validate(_props: DomainPrimitive<string>): void {
    // actual validation happens in `ensureStrong`, see below
    Promise.resolve(_props);
  }

  private static ensureStrong(plain: string): void {
    if (plain.length < MIN_LENGTH) {
      throw new ArgumentInvalidException(
        `Password must be at least ${MIN_LENGTH} characters`,
      );
    }

    if (!/[A-Z]/.test(plain) || !/[a-z]/.test(plain) || !/\d/.test(plain)) {
      throw new ArgumentInvalidException(
        'Password must contain upper case, lower case, and a number',
      );
    }
  }
}
