import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiConsumes, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  ChangeUsernameDto,
  ChangeEmailDto,
  ChangePhoneDto,
  ProfileDto,
} from "./dto/profile.dto";
import { SwaggerConsumes } from "@common/enum/swagger-consumes.enum";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "@common/utils/multer.util";
import { ProfileImages } from "./types/files";
import { Response } from "express";
import { CookieKeys } from "@common/enum/cookie.enum";
import { CookiesOptionsToken } from "@common/utils/cookie.util";
import { PublicMessage } from "@common/enum/message.enum";
import { CheckOtpDto } from "../auth/dto/auth.dto";
import { AuthDecorator } from "@common/decorators/auth.decorator";

@Controller("user")
@ApiTags("User")
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "bg_image", maxCount: 1 },
        { name: "image_profile", maxCount: 1 },
      ],
      {
        storage: multerStorage("user-profile"),
      }
    )
  )
  changeProfile(
    @UploadedFiles() files: ProfileImages,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get("profile")
  profile() {
    return this.userService.profile();
  }

  @Get("list")
  find() {
    return this.userService.find();
  }

  @Patch("change-email")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      emailDto.email
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    res.json({
      code,
      message: PublicMessage.SendOtp,
    });
  }

  @Post("verify-email-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code);
  }

  @Patch("change-phone")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      phoneDto.phone
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
    res.json({
      code,
      message: PublicMessage.SendOtp,
    });
  }

  @Post("verify-phone-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyPhone(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Patch("change-username")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(usernameDto: ChangeUsernameDto) {
    return this.userService.changeUsername(usernameDto.username);
  }

  @Get("follow/:followingId")
  @ApiParam({ name: "followingId" })
  follow(@Param("followingId") followingId: number) {
    return this.userService.followToggle(followingId);
  }
}
