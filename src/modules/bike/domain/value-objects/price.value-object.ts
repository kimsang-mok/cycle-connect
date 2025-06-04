import { DomainPrimitive, ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export class Price extends ValueObject<number> {
  constructor(value: number) {
    super({ value });
  }

  protected validate(props: DomainPrimitive<number>): void {
    const { value } = props;

    if (value < 0) {
      throw new ArgumentInvalidException('Price amount must be non-negative');
    }
  }

  multiply(days: number): Price {
    return new Price(this.props.value * days);
  }

  add(other: Price): Price {
    return new Price(this.props.value + other.props.value);
  }

  subtract(other: Price): Price {
    return new Price(this.props.value - other.props.value);
  }

  applyDiscount(percent: number): Price {
    const discount = this.props.value * (percent / 100);
    return new Price(this.props.value - discount);
  }
}
