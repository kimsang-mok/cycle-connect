import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FileUploaderPort } from '../ports/file-uploader.port';
import { fileConfig } from '@src/configs/file.config';
import { PresignedUrlResult } from '../../domain/file-uploader.types';
import { PresignedRequest } from '../../domain/value-objects/presigned-request.value-object';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class FileUploader implements FileUploaderPort {
  private readonly client = new S3Client({
    region: fileConfig.awsS3Region,
    credentials: {
      accessKeyId: fileConfig.accessKeyId,
      secretAccessKey: fileConfig.secretAccessKey,
    },
  });

  private readonly bucket = fileConfig.awsDefaultS3Bucket;

  async generatePresignedUrl(
    request: PresignedRequest,
  ): Promise<PresignedUrlResult> {
    const key = request.getKey();

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: request.mimetype,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 300 });

    return { key, url };
  }
}
