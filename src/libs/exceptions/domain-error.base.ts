import { HttpStatus } from '@nestjs/common';
import { ExceptionBase } from './exception.base';

export abstract class DomainErrorBase extends ExceptionBase {
  constructor(
    message: string,
    readonly code: string,
    readonly status: HttpStatus,
    cause?: Error,
    metadata?: unknown,
  ) {
    super(message, cause, metadata);
  }

  getStatus(): HttpStatus {
    return this.status;
  }
}
