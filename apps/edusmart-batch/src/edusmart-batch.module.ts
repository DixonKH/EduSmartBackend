import { Module } from '@nestjs/common';
import { EdusmartBatchController } from './edusmart-batch.controller';
import { EdusmartBatchService } from './edusmart-batch.service';
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule
  ],
  controllers: [EdusmartBatchController],
  providers: [EdusmartBatchService],
})
export class EdusmartBatchModule {}
