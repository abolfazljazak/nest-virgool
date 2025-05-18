import { EntityNames } from "@common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "@common/abstracts/base.entity";

@Entity(EntityNames.Follow)
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: number;

  @Column()
  followerId: number;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: "CASCADE",
  })
  following: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.following, {
    onDelete: "CASCADE",
  })
  follower: UserEntity;

  @CreateDateColumn()
  created_at: Date;
}
