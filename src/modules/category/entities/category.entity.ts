import { BaseEntity } from "@common/abstracts/base.entity";
import { EntityNames } from "@common/enum/entity.enum";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/comment.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  priority: number

  
  @OneToMany(() => BlogCategoryEntity, (blog) => blog.category)
  blog_categories: BlogCategoryEntity[];

}
