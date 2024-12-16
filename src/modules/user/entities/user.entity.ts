import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enum/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
    @Column({nullable: true})
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

    @Column()
    otpId: number

    @OneToOne(() => OtpEntity, otp => otp.user, {nullable: true})
    @JoinColumn()
    otp: OtpEntity
}