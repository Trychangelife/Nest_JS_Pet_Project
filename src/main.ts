import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { runDb } from './db';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // await runDb()
  await app.listen(5000);
  console.log(`Server listening on port: 5000`)
}
bootstrap();
