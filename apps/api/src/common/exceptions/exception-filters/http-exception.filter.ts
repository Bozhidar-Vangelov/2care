import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string })?.message ||
            'Internal server error',
      error:
        typeof exceptionResponse === 'object' && 'error' in exceptionResponse
          ? (exceptionResponse as { error?: string })?.error
          : exception.name,
    };

    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(errorResponse)}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
