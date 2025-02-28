import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { ConflictMessage, PublicMessage } from "src/common/enum/message.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let { title, priority } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = this.categoryRepository.create({
      title,
      priority,
    });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
    };
  }

  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLocaleLowerCase();
    const cateory = await this.categoryRepository.findOneBy({ title });
    if (cateory) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }

  findAll(paginationDto: PaginationDto) {
    return this.categoryRepository.findBy({});
  }
  z;

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
