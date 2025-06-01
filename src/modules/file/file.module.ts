import { Module, Provider } from '@nestjs/common';
import { CreatePresignedUrlService } from './commands/create-presigned-url.service';
import { CqrsModule } from '@nestjs/cqrs';
import { FILE_UPLOADER } from './file.di-tokens';
import { FileUploader } from './uploader/adapters/file-uploader';
import { CreatePresignedUrlController } from './commands/create-presigned-url.controller';

const commandHandlers: Provider[] = [CreatePresignedUrlService];

const services: Provider[] = [
  {
    provide: FILE_UPLOADER,
    useClass: FileUploader,
  },
];

const controllers = [CreatePresignedUrlController];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...commandHandlers, ...services],
  exports: [FILE_UPLOADER],
})
export class FileModule {}
