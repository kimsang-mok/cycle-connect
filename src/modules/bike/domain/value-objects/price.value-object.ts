import { DomainPrimitive, ValueObject } from '@src/libs/ddd';

export class Price extends ValueObject<number> {
  constructor(value: number) {
    super({ value });
  }

  protected validate(props: DomainPrimitive<number>): void {
    const { value } = props;

    if (value < 0) {
      throw new Error('Price amount must be non-negative');
    }
  }

  multiply(days: number): Price {
    return new Price(this.props.value * days);
  }
}
