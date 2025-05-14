import { EntityNames } from "src/common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityNames.BlogBookmark)
export class BlogBookmarkEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, {
    onDelete: "CASCADE",
  })
  blog: BlogEntity;
}
