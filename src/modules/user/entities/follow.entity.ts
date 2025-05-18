import { EntityNames } from "@common/enum/entity.enum";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { userInfo } from "os";

@Entity(EntityNames.Follow)
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: number;

  @Column()
  followerId: number;

  @ManyToOne(() => UserEntity, (user) => user.following, {
    onDelete: "CASCADE",
  })
  following: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: "CASCADE",
  })
  follower: UserEntity;

  @CreateDateColumn()
  created_at: Date;
}
