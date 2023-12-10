import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import User from "../entities/User";
import Project from "../entities/Project";
import Task from "../entities/Task";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mongodb",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || ""),
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  useUnifiedTopology: true,
  entities: [User, Project, Task],
  // migrations: [CreateCategories1701388927178, CreateVideos1701389287927],
  subscribers: [],
});
