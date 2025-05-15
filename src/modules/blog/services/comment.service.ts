import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BlogService } from "./blog.service";
import { BlogCommentEntity } from "../entities/comment.entity";
import { CreateCommentDto } from "../dto/comment.dto";
import { PublicMessage } from "src/common/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,
    private blogService: BlogService,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(commentDto: CreateCommentDto) {
    const { text, parentId, blogId } = commentDto;
    const { id: userId } = this.request.user;
    const blog = await this.blogService.findBlogById(blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({ parentId });
    }

    await this.blogCommentRepository.create({
      text,
      blogId,
      accepted: true,
      parentId: parent ? parentId : null,
      userId,
    });

    return {
      message: PublicMessage.CreateComment,
    };
  }
}
