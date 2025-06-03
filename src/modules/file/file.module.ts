import { Module, Provider } from '@nestjs/common';
import { CreatePresignedUrlService } from './commands/create-presigned-url.service';
import { CqrsModule } from '@nestjs/cqrs';
import { FILE_URL_RESOLVER, FILE_UPLOADER } from './file.di-tokens';
import { FileUploader } from './uploader/adapters/file-uploader';
import { CreatePresignedUrlController } from './commands/create-presigned-url.controller';
import { FileUrlResolver } from './uploader/adapters/file-url-resolver';

const commandHandlers: Provider[] = [CreatePresignedUrlService];

const services: Provider[] = [
  {
    provide: FILE_UPLOADER,
    useClass: FileUploader,
  },
  {
    provide: FILE_URL_RESOLVER,
    useClass: FileUrlResolver,
  },
];

const controllers = [CreatePresignedUrlController];

@Module({
  imports: [CqrsModule],
  controllers: [...controllers],
  providers: [...commandHandlers, ...services],
  exports: [FILE_UPLOADER, FILE_URL_RESOLVER],
})
export class FileModule {}
