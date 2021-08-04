import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { NotFoundError } from 'src/domain/errors/not-found.error';
import { Message } from './message';
import { AppLogger } from '../configuracion/ceiba-logger.service';

@Catch(NotFoundError)
export class NotFoundExceptionsFilter implements ExceptionFilter {

  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(NotFoundExceptionsFilter.name);
  }

  catch(error: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.NOT_FOUND;

    const message: Message = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: error.message,
    };

    this.logger.customError(error);
    response.status(statusCode).json(message);
  }
}
