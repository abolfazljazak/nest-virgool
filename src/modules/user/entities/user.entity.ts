import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enum/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({unique: true})
    username: string

    @Column({unique: true, nullable: true})
    phone: string

    @Column({unique: true, nullable: true})
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}