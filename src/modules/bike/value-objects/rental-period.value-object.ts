import { ValueObject } from '@src/libs/ddd';
import { ArgumentInvalidException } from '@src/libs/exceptions';

export interface RentalPeriodProps {
  start: Date;
  end: Date;
}

export class RentalPeriod extends ValueObject<RentalPeriodProps> {
  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  getDurationInDays(): number {
    const msDiff = this.props.end.getTime() - this.start.getTime();
    // Convert ms to days:
    return Math.ceil(msDiff / (1000 * 60 * 60 * 24));
  }

  overlaps(other: RentalPeriod): boolean {
    // Overlap occurs if start is before other's end and end is after other's start
    return this.start < other.end && this.end > other.start;
  }

  protected validate(props: RentalPeriodProps): void {
    if (
      !(props.start instanceof Date && props.end instanceof (Date || undefined))
    ) {
      throw new ArgumentInvalidException('Invalid date type for RentalPeriod');
    }

    if (props.end instanceof Date && props.end <= props.start) {
      throw new ArgumentInvalidException(
        'RentalPeriod end date must be after start date',
      );
    }
  }
}
