import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/exception-filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/exceptions/exception-filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/exceptions/exception-filters/prisma-exception.filter';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet());
  app.use(compression.default());

  // CORS
  const corsOrigins = configService.get<string>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters (order matters!)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
    new HttpExceptionFilter(),
  );

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = configService.get<number>('app.port');
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

void bootstrap();
