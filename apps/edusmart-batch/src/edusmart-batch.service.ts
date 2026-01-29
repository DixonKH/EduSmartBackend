import { Injectable } from '@nestjs/common';

@Injectable()
export class EdusmartBatchService {
  getHello(): string {
    return 'Welcome to Edusmart Batch Server!';
  }
}
