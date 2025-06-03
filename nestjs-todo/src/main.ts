import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS to allow requests from frontend
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  await app.listen(3100);
}
bootstrap();
