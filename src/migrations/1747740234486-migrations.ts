import { EntityNames } from "@common/enum/entity.enum";
import { Roles } from "@common/enum/role.enum";
import { UserStatus } from "src/modules/user/enums/status.enum";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrations1747740234486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.User,
        columns: [
          { name: "id", isPrimary: true, type: "serial", isNullable: false },
          {
            name: "username",
            type: "varchar(100)",
            isNullable: true,
            isUnique: true,
          },
          {
            name: "phone",
            type: "varchar(12)",
            isNullable: true,
            isUnique: true,
          },
          { name: "new_phone", type: "varchar(12)", isNullable: true },
          {
            name: "verify_phone",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          {
            name: "email",
            type: "varchar(100)",
            isNullable: true,
            isUnique: true,
          },
          { name: "new_email", type: "varchar(100)", isNullable: true },
          {
            name: "verify_email",
            type: "boolean",
            isNullable: true,
            default: false,
          },
          { name: "role", type: "enum", enum: [Roles.Admin, Roles.User] },
          {
            name: "status",
            type: "enum",
            enum: [UserStatus.Active, UserStatus.Block],
          },
          { name: "password", type: "varchar" },
          { name: "created_at", type: "timestamp", default: "now()" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.User, true)
  }
}
