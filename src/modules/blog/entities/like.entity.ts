import { EntityNames } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogLikes)
export class BlogLikesEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, user => user.blog_likes, {onDelete: 'CASCADE'})
  user: UserEntity

  @ManyToOne(() => BlogEntity, blog => blog.likes, {onDelete: 'CASCADE'})
  blog: BlogEntity
}
