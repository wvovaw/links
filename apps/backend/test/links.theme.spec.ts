import type { INestApplication } from "@nestjs/common";

import { DEFAULT_PAGE_THEME } from "@links/blocks";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

describe("link theme", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("stores a valid theme and returns it", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-page", title: "A themed page for tests" });
    const id = created.body.id as string;

    const response = await agent.patch(`/links/${id}/theme`).send({ ...DEFAULT_PAGE_THEME, accent: "#112233" });

    expect(response.status).toBe(200);
    expect(response.body.theme).toEqual({ ...DEFAULT_PAGE_THEME, accent: "#112233" });
    expect((await agent.get(`/links/${id}`)).body.theme.accent).toBe("#112233");
  });

  it("rejects a colour that is not a hex value", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-bad-color", title: "A themed page for tests" });
    const response = await agent
      .patch(`/links/${created.body.id}/theme`)
      .send({ ...DEFAULT_PAGE_THEME, accent: "blue" });

    expect(response.status).toBe(400);
  });

  it("rejects an unknown preset and an unknown field", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-bad-preset", title: "A themed page for tests" });
    const url = `/links/${created.body.id}/theme`;

    expect((await agent.patch(url).send({ ...DEFAULT_PAGE_THEME, backgroundPreset: "nope" })).status).toBe(400);
    expect((await agent.patch(url).send({ ...DEFAULT_PAGE_THEME, customCss: "* {}" })).status).toBe(400);
  });

  it("refuses to store a theme through the content endpoint", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/links").send({ slug: "theme-legacy", title: "A themed page for tests" });

    const response = await agent
      .patch(`/links/${created.body.id}/content`)
      .send({ background: "background:url(//example.com/x.png)" });

    expect(response.status).toBe(400);
  });
});
