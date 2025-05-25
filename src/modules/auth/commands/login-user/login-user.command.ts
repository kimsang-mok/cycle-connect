import { Command, CommandProps } from '@src/libs/ddd';

export class LoginUserCommand extends Command {
  readonly email: string;

  readonly password: string;

  readonly cookies: { jwt?: string };

  constructor(props: CommandProps<LoginUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.cookies = this.cookies;
  }
}
