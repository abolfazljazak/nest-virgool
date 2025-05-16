import { EntityNames } from "@common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BlogEntity } from "./blog.entity";
import { BaseEntity } from "@common/abstracts/base.entity";

@Entity(EntityNames.BlogComment)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;

  @Column()
  accepted: boolean;

  @Column()
  blogId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: "CASCADE" })
  blog: BlogEntity;

  @ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
    onDelete: "CASCADE",
  })
  parent: BlogCommentEntity;

  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  @JoinColumn({ name: "parent" })
  children: BlogCommentEntity[];

  @CreateDateColumn()
  created_at: Date;
}
