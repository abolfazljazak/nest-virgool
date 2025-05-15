import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { CategoryModule } from "../category/category.module";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { BlogLikesEntity } from "./entities/like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
