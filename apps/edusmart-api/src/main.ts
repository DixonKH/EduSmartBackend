import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { GlobalExceptionFilter } from './libs/filters/global-exception.filter';
import { configureCloudinary } from './libs/config';

async function bootstrap() {
  configureCloudinary(); 
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')),
  );

  await app.listen(process.env.PORT_API ?? 4007);
}
bootstrap();
