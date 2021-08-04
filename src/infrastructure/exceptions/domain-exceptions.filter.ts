import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from 'src/domain/errors/domain.error';
import { Message } from './message';
import { AppLogger } from '../configuracion/ceiba-logger.service';

@Catch(DomainError)
export class DomainExceptionsFilter implements ExceptionFilter {

  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(DomainExceptionsFilter.name);
  }

  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.BAD_REQUEST;

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
