import {
  Body,
  Controller,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ChangeEmailDto, ChangePhoneDto, ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { multerDestination, multerStorage } from "src/common/utils/multer.util";
import { AuthGuard } from "../auth/guards/auth.guard";
import { ProfileImages } from "./types/files";
import { Response } from "express";
import { CookieKeys } from "src/common/enum/cookie.enum";
import { CookiesOptionsToken } from "src/common/utils/cookie.util";
import { PublicMessage } from "src/common/enum/message.enum";
import { CheckOtpDto } from "../auth/dto/auth.dto";

@Controller("user")
@ApiTags("User")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
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

  @Patch("change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      emailDto.email
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken())
    res.json({
      code,
      message: PublicMessage.SendOtp
    })
  }

  @Post("verify-email-otp")
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code)
  }

  
  @Patch("change-phone")
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      phoneDto.phone
    );
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken())
    res.json({
      code,
      message: PublicMessage.SendOtp
    })
  }

  @Post("verify-phone-otp")
  async verifyPhone(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code)
  }
}
