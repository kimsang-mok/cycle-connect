import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RequestContextService } from '../context/AppRequestContext';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { Response } from 'express';
import { DomainErrorBase } from '@src/libs/exceptions/domain-error.base';

@Catch(DomainErrorBase)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainErrorBase, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const correlationId = RequestContextService.getRequestId();

    this.logger.debug(`[${correlationId}] Domain error: ${exception.message}`);

    const errorResponse = new ApiErrorResponse({
      statusCode: status,
      message: exception.message,
      error: exception.code,
      correlationId,
    });

    response.status(status).json(errorResponse);
  }
}
