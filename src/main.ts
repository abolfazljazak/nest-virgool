import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as CookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  app.use(CookieParser(process.env.COOKIE_SECRET))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
