import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestContextService } from '../context/AppRequestContext';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = RequestContextService.getRequestId();

    this.logger.debug(
      `[${correlationId}] Validation error: ${exception.message}`,
    );

    const isClassValidatorError =
      Array.isArray(exception?.response?.message) &&
      typeof exception?.response?.error === 'string';

    if (!isClassValidatorError) {
      throw exception;
    }

    const formatted = new ApiErrorResponse({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation error',
      error: exception.response.error,
      subErrors: exception.response.message,
      correlationId,
    });

    response.status(HttpStatus.BAD_REQUEST).json(formatted);
  }
}
