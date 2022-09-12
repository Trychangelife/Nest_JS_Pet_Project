require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` })
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import { HttpExceptionFilter } from './exception_filters/exception_filter';
import { BadRequestException, HttpStatus, NotFoundException, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const errorsForResponse = []
      errors.forEach((el) => {
        const constraintsKeys = Object.keys(el.constraints)
        constraintsKeys.forEach(ckey => {
          errorsForResponse.push({message: el.constraints[ckey], field: el.property})
        });
      throw new BadRequestException(errorsForResponse)
      })
    }
  }))
//app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: 5000`);
}
bootstrap();




 