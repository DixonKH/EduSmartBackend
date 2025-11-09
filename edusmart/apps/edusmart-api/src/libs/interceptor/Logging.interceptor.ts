import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger: Logger = new Logger();
  
    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const recordTime = Date.now();
      const request = context.switchToHttp().getRequest();
  
      // So‘rov ma'lumotlarini log qilish
    //   this.logger.log(
    //     `Request: ${request.method} ${request.url} - ${this.stringify(request.body)}`,
    //     'REQUEST',
    //   );
  
      return next.handle().pipe(
        tap((response) => {
          const responseTime = Date.now() - recordTime;
          this.logger.log(
            `Response: ${this.stringify(response)} - ${responseTime}ms`,
            'RESPONSE',
          );
        }),
      );
    }
  
    private stringify(data: any): string {
      try {
        return JSON.stringify(data).slice(0, 75); // Faqat birinchi 75 belgi
      } catch (error) {
        return '[Circular]'; // Agar stringify bo'lmasa, shunday qaytaradi
      }
    }
  }
  