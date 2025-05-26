import { Command, CommandProps } from '@src/libs/ddd';

export class ActivateBikeCommand extends Command {
  readonly requesterId: string;

  readonly bikeId: string;

  constructor(props: CommandProps<ActivateBikeCommand>) {
    super(props);
    this.requesterId = props.requesterId;
    this.bikeId = props.bikeId;
  }
}
