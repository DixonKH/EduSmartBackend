import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR; // Default status
      let message: any = 'Internal server error'; // Default message
  
      if (exception instanceof HttpException) {
        // NestJS HttpException xatolarini boshqarish
        status = exception.getStatus();
        const errorResponse = exception.getResponse();
  
        if (typeof errorResponse === 'object' && errorResponse !== null) {
          const responseMessage = (errorResponse as any).message;
          message = Array.isArray(responseMessage) ? responseMessage : [responseMessage];
        } else {
          message = [errorResponse]; // Oddiy stringni massivga aylantirish
        }
      } else if (exception instanceof Error) {
        // TypeError yoki boshqa JavaScript xatolari
        message = [exception.message];
      }
  
      // Xatoni formatlash
      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message, // Har doim massiv qaytariladi
      };
  
      console.error('GLOBAL ERROR:', {
        error: exception,
        formattedError: errorResponse,
      });
  
      // Javobni qaytarish
      response.status(status).json(errorResponse);
    }
  }
  