import { get } from 'env-var';
import '../libs/utils/dotenv';

export const fileConfig = {
  accessKeyId: get('ACCESS_KEY_ID').required().asString(),
  secretAccessKey: get('SECRET_ACCESS_KEY').required().asString(),
  awsDefaultS3Bucket: get('AWS_DEFAULT_S3_BUCKET').required().asString(),
  awsS3Region: get('AWS_S3_REGION').required().asString(),
  maxFileSize: 5242880, // 5mb
};
