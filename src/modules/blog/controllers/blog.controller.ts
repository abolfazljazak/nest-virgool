import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SwaggerConsumes } from '@common/enum/swagger-consumes.enum';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { Pagination } from '@common/decorators/pagination.decorator';
import { PaginationDto } from '@common/dtos/pagination.dto';
import { SkipAuth } from '@common/decorators/skip-auth.decorator';
import { FilterBlog } from '@common/decorators/filter.decorator';
import { AuthDecorator } from '@common/decorators/auth.decorator';

@Controller('blog')
@ApiTags("Blog")
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto)
  }

  @Get("my")
  myBlogs() {
    return this.blogService.myBlog()
  }

  @Get()
  @SkipAuth()
  @FilterBlog()
  @Pagination()
  find(@Query() paginationDto: PaginationDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.blogList(paginationDto, filterDto)
  }
  @Get("by-slug/:slug")
  @Pagination()
  findOneBySlug(@Param("slug") slug: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto)
  }

  @Get("like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id)
  }

  @Get("bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id)
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id)
  }

  @Put(":id")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.update(id, blogDto)
  }
}
