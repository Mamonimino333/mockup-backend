import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({limit:'50mb'}));
  app.use(urlencoded({extended: true, limit: '50mb'}));
  app.use(express.static('public'));
  await app.listen(3001);
}
bootstrap();
