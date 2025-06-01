import {
  PresignedRequestProps,
  PresignedUrlResult,
} from '../../domain/file-uploader.types';

export interface FileUploaderPort {
  generatePresignedUrl(
    request: PresignedRequestProps,
  ): Promise<PresignedUrlResult>;
}
