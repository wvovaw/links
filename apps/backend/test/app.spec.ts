import type { INestApplication } from "@nestjs/common";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createTestApp } from "./create-test-app";

/**
 * Harness smoke test: proves the app boots against the in-memory database, that migrations ran and
 * that HTTP wiring answers. Real suites replace the case below — keep one request in here so a
 * broken harness fails loudly instead of silently passing an empty run.
 */
describe("app", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves a route from the migrated schema", async () => {
    const response = await request(app.getHttpServer()).get("/public/links/no-such-slug");

    expect(response.status).toBe(404);
  });
});
