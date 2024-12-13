import { EntityNames } from "src/common/enum/entity.enum";
import { BaseEntity, Column, Entity } from "typeorm";
import { Url } from "url";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    
    @Column()
    nick_name: string

    @Column({nullable: true})
    bio: string

    @Column({nullable: true})
    image_profile: string

    @Column({nullable: true})
    bg_image: string

    @Column({nullable: true})
    gender: string

    @Column({nullable: true})
    birthday: Date

    @Column({nullable: true})
    linkedIn: string
}