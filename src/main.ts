import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: 5000`);
}
bootstrap();

//import { BadRequestException, HttpStatus, NotFoundException, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
//import { HttpExceptionFilter } from './exception_filters/exception_filter';

  // app.useGlobalPipes(new ValidationPipe({
  //   exceptionFactory: (errors) => {
  //     const errorsForResponse = []
  //     errors.forEach((el) => {
  //       const constraintsKeys = Object.keys(el.constraints)
  //       constraintsKeys.forEach(ckey => {
  //         errorsForResponse.push({message: el.constraints[ckey], field: el.property})
  //       });
  //     throw new BadRequestException(errorsForResponse)
  //     })
  //   }
  // }))
  // app.useGlobalFilters(new HttpExceptionFilter())