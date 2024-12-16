import { EntityNames } from "src/common/enum/entity.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "src/common/abstracts/base.entity";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string
    @Column()
    expriseIn: Date
    @Column()
    userId: number
    @OneToOne(() => UserEntity, user => user.otp, {onDelete: "CASCADE"})
    user: UserEntity
}