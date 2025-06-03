import { Command } from '@src/libs/ddd';
import { CommandProps } from '@src/libs/ddd';
import { PresignedRequest } from '../domain/value-objects/presigned-request.value-object';

export class CreatePresignedUrlCommand extends Command {
  readonly presigendRequest: PresignedRequest;

  constructor(props: CommandProps<CreatePresignedUrlCommand>) {
    super(props);
    this.presigendRequest = props.presigendRequest;
  }
}
