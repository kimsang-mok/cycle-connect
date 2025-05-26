import { Command, CommandProps } from '@src/libs/ddd';

export class DeactivateBikeCommand extends Command {
  readonly requesterId: string;

  readonly bikeId: string;

  constructor(props: CommandProps<DeactivateBikeCommand>) {
    super(props);
    this.requesterId = props.requesterId;
    this.bikeId = props.bikeId;
  }
}
