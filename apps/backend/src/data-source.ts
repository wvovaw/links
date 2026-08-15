import "reflect-metadata";
import { DataSource } from "typeorm";

import { databaseConfig } from "./database/database.config";

/**
 * Entry point for the TypeORM CLI (`pnpm migration:generate|run|revert`).
 * The app itself connects through `TypeOrmModule` in `app.module.ts`, which
 * adds `migrationsRun` on top of the same options.
 */
export default new DataSource(databaseConfig);
