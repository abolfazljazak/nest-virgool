import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto, CheckOtpDto } from "./dto/auth.dto";
import { SwaggerConsumes } from "@common/enum/swagger-consumes.enum";
import { Request, Response } from "express";
import { CanAccess } from "@common/decorators/role.decorator";
import { AuthDecorator } from "@common/decorators/auth.decorator";
import { Roles } from "@common/enum/role.enum";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res);
  }
  @Post("check-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto.code);
  }

  @Get("check-login")
  @AuthDecorator()
  @CanAccess(Roles.Admin)
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
