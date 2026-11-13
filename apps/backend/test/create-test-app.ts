import type { INestApplication } from "@nestjs/common";

import { Test } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { configureApp } from "../src/configure-app";

/**
 * Boots the real `AppModule` against an in-memory SQLite database and returns the initialised
 * application. `DATABASE_PATH` and the upload paths are set in `test/setup.ts`, before the app
 * module — and therefore `databaseConfig` — is imported.
 *
 * The caller owns the lifecycle: `await app.close()` in `afterAll`, otherwise the DataSource keeps
 * the process alive.
 *
 * `app.get(DataSource)` reaches the connection for fixtures; `app.getHttpServer()` feeds supertest.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = configureApp(moduleRef.createNestApplication({ logger: false }));

  await app.init();

  return app;
}
