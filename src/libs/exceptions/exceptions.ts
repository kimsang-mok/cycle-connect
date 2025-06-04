import { DomainErrorBase } from './domain-error.base';
import { HttpStatus } from '@nestjs/common';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from './exception.codes';

/**
 * Incorrect argument provided (e.g., wrong type or malformed data).
 */
export class ArgumentInvalidException extends DomainErrorBase {
  constructor(message = 'Invalid argument', cause?: Error, metadata?: unknown) {
    super(message, ARGUMENT_INVALID, HttpStatus.BAD_REQUEST, cause, metadata);
  }
}

/**
 * Required argument is missing (e.g., undefined, null, or empty).
 */
export class ArgumentNotProvidedException extends DomainErrorBase {
  constructor(message = 'Missing argument', cause?: Error, metadata?: unknown) {
    super(
      message,
      ARGUMENT_NOT_PROVIDED,
      HttpStatus.BAD_REQUEST,
      cause,
      metadata,
    );
  }
}

/**
 * Argument is out of allowed range (e.g., too short, too large, etc.).
 */
export class ArgumentOutOfRangeException extends DomainErrorBase {
  constructor(
    message = 'Argument out of range',
    cause?: Error,
    metadata?: unknown,
  ) {
    super(
      message,
      ARGUMENT_OUT_OF_RANGE,
      HttpStatus.BAD_REQUEST,
      cause,
      metadata,
    );
  }
}

/**
 * Conflict in domain state (e.g., duplicate record).
 */
export class ConflictException extends DomainErrorBase {
  constructor(
    message = 'Conflict detected',
    cause?: Error,
    metadata?: unknown,
  ) {
    super(message, CONFLICT, HttpStatus.CONFLICT, cause, metadata);
  }
}

/**
 * Entity not found (e.g., user or resource doesn’t exist).
 */
export class NotFoundException extends DomainErrorBase {
  constructor(message = 'Not found', cause?: Error, metadata?: unknown) {
    super(message, NOT_FOUND, HttpStatus.NOT_FOUND, cause, metadata);
  }
}

/**
 * Catch-all for internal domain errors not covered by other types.
 */
export class InternalServerErrorException extends DomainErrorBase {
  constructor(
    message = 'Internal server error',
    cause?: Error,
    metadata?: unknown,
  ) {
    super(
      message,
      INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      cause,
      metadata,
    );
  }
}
