import {
  Body,
  Controller,
  ParseFilePipe,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { multerDestination } from "src/common/utils/multer.util";
import { AuthGuard } from "../auth/guards/auth.guard";

@Controller("user")
@ApiTags("User")
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "bg_image", maxCount: 1 },
        { name: "image_profile", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: multerDestination("user-profile"),
          filename: () => {},
        }),
      }
    )
  )
  changeProfile(
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [],
      })
    )
    files: any,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }
}
