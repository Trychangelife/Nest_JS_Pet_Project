import { ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
        const errorResponse = {
            errorsMessage: []
        }
        const responseBody: any = exception.getResponse()
        responseBody.message.forEach(element => 
            {errorResponse.errorsMessage.push(element)
            
        });
        response.status(status).json(errorResponse)
    }
    else if (status === 401) {
        response.status(status).json({message: "check input data or JWT Token"})
    }
    else {
        response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }
}