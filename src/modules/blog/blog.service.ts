import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "./dto/blog.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { createSlug } from "src/common/utils/slugify.util";
import { BlogStatus } from "./enum/status.enum";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enum/message.enum";
import { randomId } from "src/common/utils/functions.util";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { EntityNames } from "src/common/enum/entity.enum";
import { BlogLikesEntity } from "./entities/like.entity";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikesRepository: Repository<BlogLikesEntity>,
    private categoryService: CategoryService,
    @Inject(REQUEST) private request: Request
  ) {}

  async create(blogDto: CreateBlogDto) {
    const { id } = this.request.user;
    let {
      title,
      content,
      description,
      slug,
      time_for_study,
      image,
      categories,
    } = blogDto;

    if (typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }

    slug = slug ?? title;
    slug = createSlug(slug);
    const isExist = this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }
    let blog = this.blogRepository.create({
      title,
      slug,
      content,
      status: BlogStatus.Draft,
      description,
      time_for_study,
      image,
      authorId: id,
    });
    blog = await this.blogRepository.save(blog);
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: PublicMessage.Created,
    };
  }

  checkBlogBySlug(slug: string) {
    return this.blogRepository.findOneBy({ slug });
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

  async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);
    let { category, search } = filterDto;
    let where = "";
    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += " AND ";
      where += "category.title = LOWER(:category)";
    }
    if (search) {
      if (where.length > 0) where += " AND ";
      search = `%${search}%`;
      where +=
        "CONCAT(blog.title, blog.description, blog.content) ILIKE :search";
    }
    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityNames.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .leftJoin("blog.author", "author")
      .leftJoin("author.profile", "profile")
      .addSelect(["categories.id", "category.title", "author.id", "author.username", "profile.nick_name"])
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .where(where, { category, search })
      .orderBy("blog.id")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // const [blogs, count] = await this.blogRepository.findAndCount({
    //   relations: {
    //     categories: {
    //       category: true,
    //     },
    //   },
    //   where,
    //   select: {
    //     categories: {
    //       category: {
    //         title: true,
    //       },
    //     },
    //   },
    //   order: {
    //     id: "DESC",
    //   },
    //   skip,
    //   take: limit,
    // });

    return {
      pagination: paginationGenerator(count, page, limit),
      blogs,
    };
  }

  async findBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);
    return blog;
  }

  async delete(id: number) {
    await this.findBlogById(id);
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }

  async update(id: number, blogDto: UpdateBlogDto) {
    let {
      title,
      content,
      description,
      slug,
      time_for_study,
      image,
      categories,
    } = blogDto;

    let blog = await this.findBlogById(id);

    if (typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }
    let slugData = null;
    if (title) {
      slugData = title;
      blog.title = title;
    }
    if (slug) slugData = slug;
    if (slugData) {
      slug = createSlug(slug);
      const isExist = await this.checkBlogBySlug(slug);
      if (isExist && isExist.id !== id) {
        slug += `-${randomId()}`;
      }
      blog.slug = slug;
    }

    if (content) blog.content = content;
    if (description) blog.description = description;
    if (time_for_study) blog.time_for_study = time_for_study;
    if (image) blog.image = image;

    blog = await this.blogRepository.save(blog);

    await this.blogCategoryRepository.delete({ blogId: blog.id });

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: PublicMessage.Updated,
    };
  }

  async likeToggle(blogId: number) {
    const { id: userId } = this.request.user;
    const blog = await this.findBlogById(blogId);
    const isLiked = await this.blogLikesRepository.findOneBy({
      blogId: blog.id,
      userId: userId,
    });
    let message: string;
    if (isLiked) {
      await this.blogLikesRepository.delete({ id: isLiked.id });
      message = PublicMessage.DissLike;
    } else {
      await this.blogLikesRepository.insert({
        blogId: blog.id,
        userId: userId,
      });
      message = PublicMessage.Like;
    }

    return { message };
  }
}
