import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enum/swagger-consumes.enum';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post("user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  userExistence(@Body() authDto: AuthDto) {
    return this.authService.userExistence(authDto)
  }
}
