import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { KavenegarService } from "./kavenegar.service";

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  providers: [KavenegarService],
  exports: [KavenegarService],
})
export class CustomHttpModule {}
