import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePresignedUrlCommand } from './create-presigned-url.command';
import { Inject } from '@nestjs/common';
import { FILE_UPLOADER } from '../file.di-tokens';
import { FileUploaderPort } from '../uploader/ports/file-uploader.port';
import { PresignedUrlResponseDto } from '../dtos/presigned-url.response.dto';

@CommandHandler(CreatePresignedUrlCommand)
export class CreatePresignedUrlService
  implements ICommandHandler<CreatePresignedUrlCommand, PresignedUrlResponseDto>
{
  constructor(
    @Inject(FILE_UPLOADER) protected readonly uploader: FileUploaderPort,
  ) {}

  execute(
    command: CreatePresignedUrlCommand,
  ): Promise<PresignedUrlResponseDto> {
    return this.uploader.generatePresignedUrl(command.presigendRequest);
  }
}
