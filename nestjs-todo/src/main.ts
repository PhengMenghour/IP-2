import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS to allow requests from frontend
  app.enableCors();

  await app.listen(3100);
}
bootstrap();
