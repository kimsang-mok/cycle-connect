import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RequestContextService } from '../context/AppRequestContext';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = RequestContextService.getRequestId();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    this.logger.debug(
      `[${RequestContextService.getRequestId()}] Unexpected exception: ${message}`,
    );

    const errorResponse = new ApiErrorResponse({
      statusCode: status,
      message,
      error: 'UNEXPECTED_ERROR',
      correlationId,
    });

    response.status(status).json(errorResponse);
  }
}
