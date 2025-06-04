import { HttpStatus } from '@nestjs/common';
import { DomainErrorBase } from './domain-error.base';

export function defineDomainError({
  message,
  code,
  status,
}: {
  message: string;
  code: string;
  status: HttpStatus;
}) {
  return class extends DomainErrorBase {
    static readonly message = message;
    constructor(cause?: Error, metadata?: unknown) {
      super(message, code, status, cause, metadata);
    }
  };
}
