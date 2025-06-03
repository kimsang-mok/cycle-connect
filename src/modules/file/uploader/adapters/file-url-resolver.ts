import { fileConfig } from '@src/configs/file.config';
import { FileUrlResolverPort } from '../ports/file-url-resolver.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUrlResolver implements FileUrlResolverPort {
  resolveUrl(key: string): string {
    return `https://${fileConfig.awsDefaultS3Bucket}.s3.${fileConfig.awsS3Region}.amazonaws.com/${key}`;
  }
}
