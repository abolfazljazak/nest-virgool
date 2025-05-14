import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enum/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  new_phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  new_email: string;

  @Column({ nullable: true, default: false })
  verify_email: boolean;

  @Column({ nullable: true, default: false })
  verify_phone: boolean;

  @Column()
  password: string;

  @Column()
  otpId: number;
  
  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: OtpEntity;
  
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  profile: ProfileEntity;
  
  @Column({ nullable: true })
  profileId: number;

  @OneToMany(() => BlogEntity, blog => blog.author)
  blogs: BlogEntity[]

  @OneToMany(() => BlogLikesEntity, like => like.user)
  blog_likes: BlogLikesEntity[]

  @OneToMany(() => BlogBookmarkEntity, bookmark => bookmark.user)
  blog_bookmarks: BlogBookmarkEntity[]

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;
}
