import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { SwaggerConfigInit } from "./config/swagger.config";
import * as CookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets("public");
  SwaggerConfigInit(app);
  app.use(CookieParser(process.env.COOKIE_SECRET));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
