import { NestFactory } from '@nestjs/core';
import { EdusmartBatchModule } from './edusmart-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(EdusmartBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
