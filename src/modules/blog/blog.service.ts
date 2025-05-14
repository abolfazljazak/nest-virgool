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
        slug += `-${randomId()}`
    }
    const blog = this.blogRepository.create({
      title,
      slug,
      content,
      status: BlogStatus.Draft,
      description,
      time_for_study,
      image,
    });
    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.Created,
    };
  }

  checkBlogBySlug(slug: string) {
    return !!this.blogRepository.findOneBy({ slug });
  }
}
