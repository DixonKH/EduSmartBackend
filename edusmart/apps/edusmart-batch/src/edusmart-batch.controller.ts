import { Controller, Get } from '@nestjs/common';
import { EdusmartBatchService } from './edusmart-batch.service';

@Controller()
export class EdusmartBatchController {
  constructor(private readonly edusmartBatchService: EdusmartBatchService) {}

  @Get()
  getHello(): string {
    return this.edusmartBatchService.getHello();
  }
}
