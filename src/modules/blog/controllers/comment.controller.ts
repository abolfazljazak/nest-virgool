import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { BlogCommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { SwaggerConsumes } from "@common/enum/swagger-consumes.enum";
import { Pagination } from "@common/decorators/pagination.decorator";
import { PaginationDto } from "@common/dtos/pagination.dto";

@Controller("blog-comment")
@ApiTags("Blog-Comment")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() commentDto: CreateCommentDto) {
    return this.blogCommentService.create(commentDto);
  }

  @Get()
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.blogCommentService.find(paginationDto);
  }

  @Put("accept/:id")
  accept(@Param("id", ParseIntPipe) id: number) {
    return this.blogCommentService.accept(id);
  }

  @Put("reject/:id")
  reject(@Param("id", ParseIntPipe) id: number) {
    return this.blogCommentService.reject(id);
  }
}
