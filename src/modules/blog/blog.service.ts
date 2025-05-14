import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { createSlug } from "src/common/utils/slugify.util";
import { BlogStatus } from "./enum/status.enum";
import { PublicMessage } from "src/common/enum/message.enum";
import { randomId } from "src/common/utils/functions.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(blogDto: CreateBlogDto) {
    const { id } = this.request.user;
    let { title, content, description, slug, time_for_study, image } = blogDto;
    slug = slug ?? title;
    slug = createSlug(slug);
    const isExist = this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }
    const blog = this.blogRepository.create({
      title,
      slug,
      content,
      status: BlogStatus.Draft,
      description,
      time_for_study,
      image,
      authorId: id,
    });
    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.Created,
    };
  }

  checkBlogBySlug(slug: string) {
    return !!this.blogRepository.findOneBy({ slug });
  }

  async myBlog() {
    const { id } = this.request.user;
    return this.blogRepository.find({
      where: {
        authorId: id,
      },
      order: {
        id: "DESC",
      },
    });
  }

  async blogList(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);
    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: {
        id: "DESC",
      },
      skip,
      take: limit,
    });

    return {
        pagination: paginationGenerator(count, page, limit),
        blogs
    }
  }
}
