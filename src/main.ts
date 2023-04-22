require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` })
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './exception_filters/exception_filter'
import { BadRequestException, HttpStatus, NotFoundException, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';


 
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    transform: true,
    exceptionFactory: (errors) => {
      const customErrors = [];
      errors.forEach(e => {
        const keys = Object.keys(e.constraints)
        keys.forEach(k => {
          customErrors.push({
            message: e.constraints[k],
            field: e.property,
          })
        })
      })
      throw new BadRequestException(customErrors)
    }  
  }))  
  
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     stopAtFirstError: false,
  //     exceptionFactory: (errors) => {
  //       const customErrors = errors.map((e) => {
  //         const firstError = JSON.stringify(e.constraints); 
  //         const errorResponseForEmail = {message: firstError ,field: e.property,}
  //         return errorResponseForEmail;
  //       });
  //       throw new BadRequestException(customErrors.slice(0,2));
  //     },
  //   }),
  // );
  
  // app.useGlobalPipes(
  //   new ValidationPipe({  
  //     stopAtFirstError: true,
  //     exceptionFactory: (errorsArr: ValidationError[]) => {
  //       const  errors = [];
  //       errorsArr.forEach((e) => {
  //         errors.push({
  //           message: e.constraints[Object.keys(e.constraints)[0]],
  //           field: e.property
  //         })
  //       console.log(errors)
  //       })
  //       throw new BadRequestException(errors)
        
  //     },
  //   })
  //  )
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: 5000`);
}
bootstrap();

