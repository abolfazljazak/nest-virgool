import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDto } from './dto/image.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '@common/decorators/auth.decorator';
import { UploadFile } from '@common/interceptor/upload.interceptor';
import { MulterFile } from '@common/utils/multer.util';
import { SwaggerConsumes } from '@common/enum/swagger-consumes.enum';

@Controller('image')
@ApiTags("Image")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFile("image"))
  create(@Body() imageDto: ImageDto, @UploadedFile() image: MulterFile) {
    return this.imageService.create(imageDto, image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
