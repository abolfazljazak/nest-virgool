import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { BlogCommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { SwaggerConsumes } from "src/common/enum/swagger-consumes.enum";

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
}
