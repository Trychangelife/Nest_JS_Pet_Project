import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
//import { runDb } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser())
  // await runDb()
  await app.listen(5000);
  console.log(`Server listening on port: 5000`)
}
bootstrap();
