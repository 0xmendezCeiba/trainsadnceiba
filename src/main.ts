import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionsFilter } from './infrastructure/exceptions/domain-exceptions.filter';
import { InvalidValueExceptionsFilter } from './infrastructure/exceptions/invalid-value-exceptions.filter';
import { NotFoundExceptionsFilter } from './infrastructure/exceptions/not-found-exceptions.filter';
import { AppLogger } from './infrastructure/configuration/ceiba-logger.service';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './infrastructure/configuration/environment/env-variables.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(AppLogger);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionsFilter(logger));
  app.useGlobalFilters(new NotFoundExceptionsFilter(logger));
  app.useGlobalFilters(new InvalidValueExceptionsFilter(logger));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Bloque Arquitectura Hexagonal Node')
    .setDescription('Bloque que hace uso de Nest.js para la creación de API\'s con Node.js')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/api/doc', app, swaggerDocument);

  app.setGlobalPrefix(configService.get(EnvVariables.APPLICATION_CONTEXT_PATH));
  app.enableCors();
  await app.listen(configService.get(EnvVariables.APPLICATION_PORT));
}
bootstrap();
