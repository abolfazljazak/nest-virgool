import { EntityNames } from "src/common/enum/entity.enum";
import { BaseEntity, Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string
    @Column()
    expriseIn: string
    @Column()
    userId: number
    @OneToOne(() => UserEntity, user => user.otp, {onDelete: "CASCADE"})
    user: UserEntity
}