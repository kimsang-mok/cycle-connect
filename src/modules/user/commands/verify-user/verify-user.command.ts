import { Command } from '@src/libs/ddd';
import { CommandProps } from '@src/libs/ddd';

export class VerifyUserCommand extends Command {
  readonly code: string;

  constructor(props: CommandProps<VerifyUserCommand>) {
    super(props);
    this.code = props.code;
  }
}
