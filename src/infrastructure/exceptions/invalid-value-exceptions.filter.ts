import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { InvalidValueError } from 'src/domain/errors/invalid-value.error';
import { Message } from './message';
import { AppLogger } from '../configuracion/ceiba-logger.service';

@Catch(InvalidValueError)
export class InvalidValueExceptionsFilter implements ExceptionFilter {

  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(InvalidValueExceptionsFilter.name);
  }

  catch(error: InvalidValueError, host: ArgumentsHost) {
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
