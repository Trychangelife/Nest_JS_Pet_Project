import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser())
  //app.useGlobalPipes(new ValidationPipe({transform: false}))
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: 5000`)
}
bootstrap();
