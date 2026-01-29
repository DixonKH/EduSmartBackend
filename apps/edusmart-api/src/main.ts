import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { GlobalExceptionFilter } from './libs/filters/global-exception.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true}));
	app.enableCors({ origin: true, credentials: true });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use('/uploads', express.static('./uploads'));
  await app.listen(process.env.PORT_API ?? 4007);
}
bootstrap();
