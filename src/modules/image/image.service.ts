import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { ImageDto } from "./dto/image.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "./entities/image.entity";
import { Repository } from "typeorm";
import { MulterFile } from "@common/utils/multer.util";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { NotFoundMessage, PublicMessage } from "@common/enum/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private request: Request
  ) {}
  async create(imageDto: ImageDto, image: MulterFile) {
    const { id: userId } = this.request.user;
    const { alt, name } = imageDto;
    let location = image?.path?.slice(7);
    await this.imageRepository.insert({
      userId,
      alt: alt || name,
      name,
      location,
    });

    return {
      message: PublicMessage.Created,
    };
  }

  async findAll() {
    const { id: userId } = this.request.user;
    return this.imageRepository.find({
      where: { userId },
      order: { id: "DESC" },
    });
  }

  async findOne(id: number) {
    const { id: userId } = this.request.user;
    const image = await this.imageRepository.findOne({
      where: {
        userId,
        id,
      },
      order: { id: "DESC" },
    });
    if (!image) throw new NotFoundException(NotFoundMessage.NotFound);
    return image;
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
    return {
      message: PublicMessage.Deleted,
    };
  }
}
