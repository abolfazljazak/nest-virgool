import { BaseEntity } from "@common/abstracts/base.entity";
import { EntityNames } from "@common/enum/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";

@Entity(EntityNames.Image)
export class ImageEntity extends BaseEntity {
    @Column()
    name: string
    
    @Column()
    location: string

    @Column()
    alt: string

    @Column()
    userId: number
    @ManyToOne(() => UserEntity, (user) => user.images, { onDelete: "CASCADE" })
    user: UserEntity

    @CreateDateColumn()
    created_at: Date
}
