import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({limit:'50mb'}));
  app.use(urlencorded({extended: true, limit: '50mb'}));
  await app.listen(3001);
}
bootstrap();
