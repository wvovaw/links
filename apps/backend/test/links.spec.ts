import type { INestApplication } from "@nestjs/common";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

describe("links", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  /* The list screen prints "updated" beside every page: the row needs the time the page was last written. */
  it("carries a page's update time as an ISO string", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "updated-at", title: "A page with a timestamp" });

    expect(created.status).toBe(201);
    expect(Number.isNaN(Date.parse(created.body.updatedAt as string))).toBe(false);

    const listed = (await agent.get("/links")).body as { id: string; updatedAt?: string }[];

    expect(listed.find((link) => link.id === created.body.id)?.updatedAt).toBeTypeOf("string");
  });
});
