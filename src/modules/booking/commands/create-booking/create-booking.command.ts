import { Command, CommandProps } from '@src/libs/ddd';

export class CreateBookingCommand extends Command {
  readonly bikeId: string;

  readonly customerId: string;

  readonly startDate: Date;

  readonly endDate: Date;

  constructor(props: CommandProps<CreateBookingCommand>) {
    super(props);
    this.bikeId = props.bikeId;
    this.customerId = props.customerId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }
}
