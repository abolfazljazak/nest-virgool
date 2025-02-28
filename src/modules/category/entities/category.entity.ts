import { EntityNames } from "src/common/enum/entity.enum";
import { BaseEntity, Column, Entity } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  priority: number
}
