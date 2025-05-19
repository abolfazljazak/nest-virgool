import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

config({path: join(process.cwd(), ".env")})

const { DB_HOST, DB_PASSWORD, DB_USERNAME, DB_NAME, DB_PORT } = process.env;

let dataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  entities: ["dist/**/**/**/*.entity.{ts, js}", "dist/**/**/*.entity.{ts, js}"],
  migrations: [
    "dist/src/migrations/*{.ts,.js}"
  ],
  migrationsTableName: "virgool_migrations_db"
});
