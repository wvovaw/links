import type { DataSourceOptions } from "typeorm";

import { join } from "node:path";

import { RefreshSession } from "../auth/refresh-session.entity";
import { Link } from "../links/link.entity";
import { BlockImage } from "../storage/block-image.entity";
import { User } from "../users/user.entity";

/**
 * Single source of truth for the database connection: consumed by the Nest
 * `TypeOrmModule` at runtime and by the TypeORM CLI (see `data-source.ts`)
 * for generate/run/revert.
 *
 * Schema changes go through migrations only — `synchronize` stays off. Note
 * that migrations are *not* auto-run here: the app opts in (see
 * `app.module.ts`), while the CLI must stay in control of when they apply.
 */
export const databaseConfig = {
  type: "better-sqlite3",
  database: process.env.DATABASE_PATH ?? "data.sqlite",
  entities: [User, RefreshSession, Link, BlockImage],
  migrations: [join(__dirname, "..", "migrations", "*.{ts,js}")],
  synchronize: false,
} satisfies DataSourceOptions;
