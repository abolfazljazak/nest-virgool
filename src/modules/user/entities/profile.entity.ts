import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enum/entity.enum";
import { Column, Entity } from "typeorm";

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

    @Column({nullable: true})
    x_profile: string
}