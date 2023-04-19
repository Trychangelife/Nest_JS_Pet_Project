require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` })
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { BadRequestException, HttpStatus, NotFoundException, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
// import { HttpExceptionFilter } from './exception_filters/exception_filter';


export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     stopAtFirstError: false,
  //     exceptionFactory: (errors) => {
  //       const customErrors = errors.map((e) => {
  //         const firstError = JSON.stringify(e.constraints);
  //         return { field: e.property, message: firstError };
  //       });
  //       throw new BadRequestException(customErrors);
  //     },
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errorsArr: ValidationError[]) => {
        const errors = [];
        errorsArr.forEach((e) => {
          errors.push({
            message: e.constraints[Object.keys(e.constraints)[0]],
            field: e.property
          })
        })
        throw new BadRequestException(errors)
        
      },
    })
   )
// app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: 5000`);
}
bootstrap();

