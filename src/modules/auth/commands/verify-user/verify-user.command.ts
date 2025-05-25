import { CommandProps } from '@src/libs/ddd';
import { Command } from '@src/libs/ddd';

export class VerifyUserCommand extends Command {
  readonly code: string;

  readonly target: string;

  readonly cookies: { jwt?: string };

  constructor(props: CommandProps<VerifyUserCommand>) {
    super(props);
    this.code = props.code;
    this.target = props.target;
    this.cookies = props.cookies;
  }
}
