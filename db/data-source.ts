import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import Product from "../entities/product.entity";
import User from "../entities/user.entity";
import 'dotenv/config'

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  throw new Error("DB_HOST, DB_PORT, DB_NAME, DB_USER, and DB_PASSWORD must be set");
}

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  extra: { max: 5, min: 2 }, // connection pool
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [Product, User],
  migrations: [
    path.join(
      __dirname,
      "migrations",
      __filename.endsWith(".js") ? "*.js" : "*.ts"
    ),
  ],
});

export default dataSource;