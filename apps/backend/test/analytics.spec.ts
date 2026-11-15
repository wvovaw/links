import type { INestApplication } from "@nestjs/common";

import { randomUUID } from "node:crypto";
import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { BlockEvent } from "../src/analytics/block-event.entity";
import { LinkStatus } from "../src/links/link-status";
import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

type Agent = Awaited<ReturnType<typeof authenticate>>;

/**
 * A page owned by a fresh account, already moved to `status`. Every test gets its own page, which is
 * what isolates it from the analytics window: the window is keyed by link and block.
 */
async function pageWithStatus(app: INestApplication, status: LinkStatus) {
  const agent = await authenticate(app);
  const slug = `page-${randomUUID().slice(0, 8)}`;

  const created = await agent.post("/links").send({ slug, title: "Analytics test page" }).expect(201);
  await agent.patch(`/links/${created.body.id}/content`).send({ status }).expect(200);

  return { agent, id: created.body.id as string, slug };
}

const publishPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.PUBLISHED);
const draftPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.DRAFT);

/** The id the owner's list reports for a slug, which is how a page is addressed from the public side. */
async function linkId(agent: Agent, slug: string) {
  const { body } = await agent.get("/links").expect(200);
  const link = (body as { id: string; slug: string }[]).find((candidate) => candidate.slug === slug);

  if (!link) throw new Error(`no link for ${slug}`);

  return link.id;
}

/** Rows one page holds: the suite shares a database, so a bare count would see other tests' events. */
async function eventCount(app: INestApplication, id: string) {
  return app
    .get(DataSource)
    .getRepository(BlockEvent)
    .count({ where: { linkId: id } });
}

describe("block analytics", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("records a click for a published page and aggregates it for the owner", async () => {
    const { agent, slug } = await publishPage(app);

    expect(
      (await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" }))
        .status,
    ).toBe(201);

    const stats = await agent.get(`/links/${await linkId(agent, slug)}/stats`);

    expect(stats.body.blocks).toEqual([{ blockId: "b1", clicks: 1, views: 0 }]);
  });

  it("refuses events for a draft page and for unknown fields", async () => {
    const { slug } = await draftPage(app);

    expect(
      (await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" }))
        .status,
    ).toBe(404);
    expect(
      (
        await request(app.getHttpServer())
          .post(`/public/links/${slug}/events`)
          .send({ blockId: "b1", kind: "click", ip: "1.2.3.4" })
      ).status,
    ).toBe(400);
  });

  /* A slug that never existed answers like an unpublished one: the public side never says which. */
  it("answers 404 for a slug no page holds", async () => {
    expect(
      (
        await request(app.getHttpServer())
          .post("/public/links/no-such-page/events")
          .send({ blockId: "b1", kind: "click" })
      ).status,
    ).toBe(404);
  });

  it("exhausts the window without storing the rejected requests", async () => {
    const { id, slug } = await publishPage(app);
    const post = (blockId: string) =>
      request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId, kind: "click" });

    const responses = await Promise.all(Array.from({ length: 70 }, () => post("b1")));
    const accepted = responses.filter((response) => response.status === 201).length;

    expect(accepted).toBeLessThanOrEqual(60);
    expect(responses.some((response) => response.status === 429)).toBe(true);
    expect(await eventCount(app, id)).toBe(accepted);

    /* The window belongs to the block: one busy block must not silence the rest of the page. */
    expect((await post("b2")).status).toBe(201);
  });

  it("counts only the window a caller asks about", async () => {
    const { agent, id, slug } = await publishPage(app);
    await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" });

    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const hourAhead = new Date(Date.now() + 3_600_000).toISOString();
    const statsIn = (from?: string, to?: string) =>
      agent.get(`/links/${id}/stats`).query({ ...(from && { from }), ...(to && { to }) });

    expect((await statsIn(hourAgo)).body.blocks).toEqual([{ blockId: "b1", clicks: 1, views: 0 }]);
    expect((await statsIn(undefined, hourAgo)).body.blocks).toEqual([]);
    expect((await statsIn(hourAgo, hourAhead)).body.blocks).toEqual([{ blockId: "b1", clicks: 1, views: 0 }]);
    expect((await statsIn("yesterday")).status).toBe(400);
  });

  it("keeps another user's stats out of reach", async () => {
    const owner = await publishPage(app);
    const stranger = await authenticate(app);

    expect((await stranger.get(`/links/${await linkId(owner.agent, owner.slug)}/stats`)).status).toBe(404);
  });

  it("deletes events with the link", async () => {
    const { agent, slug } = await publishPage(app);
    const id = await linkId(agent, slug);
    await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" });

    expect(await eventCount(app, id)).toBe(1);

    await agent.delete(`/links/${id}`).expect(204);

    expect(await eventCount(app, id)).toBe(0);
  });
});
