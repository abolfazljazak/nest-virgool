import { Module } from "@nestjs/common";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controllers/blog.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { CategoryModule } from "../category/category.module";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogLikesEntity } from "./entities/like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";
import { BlogCommentEntity } from "./entities/comment.entity";
import { BlogCommentService } from "./services/comment.service";
import { BlogCommentController } from "./controllers/comment.controller";

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
    ]),
  ],
  controllers: [BlogController, BlogCommentController],
  providers: [BlogService, BlogCommentService],
})
export class BlogModule {}
