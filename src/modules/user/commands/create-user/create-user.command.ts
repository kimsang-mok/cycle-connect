import { Command, CommandProps } from '@src/libs/ddd';
import { UserRoles } from '../../domain/user.types';

export class CreateUserCommand extends Command {
  readonly email: string;

  readonly password: string;

  readonly role: UserRoles;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
  }
}
