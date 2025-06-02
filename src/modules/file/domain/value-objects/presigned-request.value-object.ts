import { ValueObject } from '@src/libs/ddd';
import { PresignedRequestProps } from '../file-uploader.types';

export class PresignedRequest extends ValueObject<PresignedRequestProps> {
  private readonly extension: string;

  constructor(props: PresignedRequestProps) {
    super(props);

    const split = this.props.filename.split('.');
    if (split.length < 2) {
      throw new Error('Filename must include an extension');
    }

    this.extension = split.pop()!;
  }

  protected validate(props: PresignedRequestProps): void {
    const { filename, mimetype, uploaderId } = props;

    if (!filename || typeof filename !== 'string') {
      throw new Error('Invalid filename');
    }

    if (!mimetype || typeof mimetype !== 'string') {
      throw new Error('Invalid mimetype');
    }

    if (!uploaderId || typeof uploaderId !== 'string') {
      throw new Error('Invalid uploaderId');
    }
  }

  get filename(): string {
    return this.props.filename;
  }

  get mimetype(): string {
    return this.props.mimetype;
  }

  get uploaderId(): string {
    return this.props.uploaderId;
  }

  /**
   * Generates a structured key with optional prefixing strategy
   * Example: uploads/userId/1688991234-b8d7bike.jpg
   */
  getKey(): string {
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2);
    return `uploads/${this.uploaderId}/${timestamp}-${rand}.${this.extension}`;
  }
}
