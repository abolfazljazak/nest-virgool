import { Inject, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { PublicMessage } from "src/common/enum/message.enum";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { title, priority } = createCategoryDto;
    const category = this.categoryRepository.create({
      title,
      priority,
    });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created
    }
  }

  findAll() {
    return `This action returns all category`;
  }z

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
