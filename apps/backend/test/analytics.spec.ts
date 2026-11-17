import type { INestApplication } from "@nestjs/common";

import { randomUUID } from "node:crypto";
import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { BlockEvent } from "../src/analytics/block-event.entity";
import { PageView } from "../src/analytics/page-view.entity";
import { visitorHashOf } from "../src/analytics/visitor-hash";
import { LinkStatus } from "../src/links/link-status";
import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

type Agent = Awaited<ReturnType<typeof authenticate>>;

/**
 * The stored page content the public endpoint reads block ids from. Only the ids matter to analytics, but a
 * page with no blocks could report nothing at all.
 */
const pageBlocks = [
  { id: "b1", name: "Paragraph", properties: {} },
  { id: "b2", name: "Button", properties: {} },
];

/**
 * A page owned by a fresh account, already moved to `status`. Every test gets its own page, which is
 * what isolates it from the analytics window: the window is keyed by link and block.
 */
async function pageWithStatus(app: INestApplication, status: LinkStatus, blocks: unknown[] = pageBlocks) {
  const agent = await authenticate(app);
  const slug = `page-${randomUUID().slice(0, 8)}`;

  const created = await agent.post("/links").send({ slug, title: "Analytics test page" }).expect(201);
  await agent.patch(`/links/${created.body.id}/content`).send({ blocks, status }).expect(200);

  return { agent, id: created.body.id as string, slug };
}

/** The one public write these tests exercise. */
const postEvent = (app: INestApplication, slug: string, body: { blockId: string; kind: string }) =>
  request(app.getHttpServer()).post(`/public/links/${slug}/events`).send(body);

const publishPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.PUBLISHED);
const draftPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.DRAFT);

/**
 * The one public view write. Every view test sends its own `User-Agent`: the window is keyed by the visitor
 * hash, so a shared agent would spend one visitor's budget across tests.
 */
const postView = (
  app: INestApplication,
  slug: string,
  body: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) => request(app.getHttpServer()).post(`/public/links/${slug}/views`).set(headers).send(body);

/** How many visits one page stored: the suite shares a database, so a bare count would see other pages’ rows. */
async function viewCount(app: INestApplication, id: string) {
  return app.get(DataSource).getRepository(PageView).count({ where: { linkId: id } });
}

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

    expect(accepted).toBe(60);
    expect(responses.some((response) => response.status === 429)).toBe(true);
    expect(await eventCount(app, id)).toBe(accepted);

    /* The window belongs to the block: one busy block must not silence the rest of the page. */
    expect((await post("b2")).status).toBe(201);
  });

  /*
    The per-block ceiling alone says nothing about a page: a page with six blocks would take six budgets.
    A page takes 300 events a minute whatever it is made of, so a block nobody has touched is still refused
    once the page's five earlier blocks have spent the budget.
  */
  it("caps a page's events whatever its block count", async () => {
    const blocks = Array.from({ length: 6 }, (_, index) => ({
      id: `b${index + 1}`,
      name: "Paragraph",
      properties: {},
    }));
    const { id, slug } = await pageWithStatus(app, LinkStatus.PUBLISHED, blocks);

    for (const block of blocks.slice(0, 5)) {
      const responses = await Promise.all(
        Array.from({ length: 60 }, () => postEvent(app, slug, { blockId: block.id, kind: "click" })),
      );
      expect(responses.every((response) => response.status === 201)).toBe(true);
    }

    expect((await postEvent(app, slug, { blockId: "b6", kind: "click" })).status).toBe(429);
    expect(await eventCount(app, id)).toBe(300);
  });

  /* The id is the window key and a row of its own: one the page does not hold may do neither. */
  it("refuses a block the page does not hold", async () => {
    const { id, slug } = await publishPage(app);

    expect((await postEvent(app, slug, { blockId: "not-a-block", kind: "click" })).status).toBe(400);
    expect(await eventCount(app, id)).toBe(0);
  });

  it("keeps the window bounded to the blocks the page holds", async () => {
    const { id, slug } = await publishPage(app);

    const foreign = await Promise.all(
      Array.from({ length: 70 }, (_, index) => postEvent(app, slug, { blockId: `foreign-${index}`, kind: "click" })),
    );
    expect(foreign.every((response) => response.status === 400)).toBe(true);

    /* A window full of invented ids would answer 429 here; the page's own block still gets its full 60. */
    const real = await Promise.all(
      Array.from({ length: 60 }, () => postEvent(app, slug, { blockId: "b1", kind: "click" })),
    );
    expect(real.every((response) => response.status === 201)).toBe(true);

    expect(await eventCount(app, id)).toBe(60);
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

  it("deletes views with the page", async () => {
    const { agent, slug } = await publishPage(app);
    const id = await linkId(agent, slug);
    const views = app.get(DataSource).getRepository(PageView);

    await views.save(views.create({ linkId: id, visitorHash: "0123456789abcdef" }));

    expect(await views.count({ where: { linkId: id } })).toBe(1);

    await agent.delete(`/links/${id}`).expect(204);

    /* A row nothing can read is a row that only grows the file: the foreign key takes it with the page. */
    expect(await views.count({ where: { linkId: id } })).toBe(0);
  });

  it("deletes events with the link", async () => {
    const { agent, slug } = await publishPage(app);
    const id = await linkId(agent, slug);
    await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" });

    expect(await eventCount(app, id)).toBe(1);

    await agent.delete(`/links/${id}`).expect(204);

    expect(await eventCount(app, id)).toBe(0);
  });

  describe("page views", () => {
    it("stores a view with its source", async () => {
      const { id, slug } = await publishPage(app);

      const response = await postView(
        app,
        slug,
        { utmSource: "Telegram", utmMedium: "social" },
        { "User-Agent": "view-source-agent" },
      );

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ ok: true });

      const [row] = await app.get(DataSource).getRepository(PageView).find({ where: { linkId: id } });

      expect(row.utmSource).toBe("telegram");
      expect(row.utmMedium).toBe("social");
      expect(row.referrerInternal).toBe(false);
    });

    /* A slug nobody published answers like one nobody holds: the public side never says which. */
    it("refuses a view for a draft page", async () => {
      const { id, slug } = await draftPage(app);

      expect((await postView(app, slug, {}, { "User-Agent": "draft-agent" })).status).toBe(404);
      expect(await viewCount(app, id)).toBe(0);
    });

    it("refuses a view body that carries visitor data", async () => {
      const { id, slug } = await publishPage(app);

      expect(
        (await postView(app, slug, { utmSource: "x", userAgent: "y" }, { "User-Agent": "hostile-agent" })).status,
      ).toBe(400);
      expect(await viewCount(app, id)).toBe(0);
    });

    /*
      A page load is one event, so the per-key limit is a reload guard rather than a traffic ceiling: ten
      reloads a minute from one visitor are accepted, the eleventh is not, and none of them stores a row.
    */
    it("counts a reload against the same visitor", async () => {
      const { id, slug } = await publishPage(app);
      const reload = () => postView(app, slug, {}, { "User-Agent": "reload-agent" });

      for (let attempt = 0; attempt < 10; attempt += 1) expect((await reload()).status).toBe(201);

      expect((await reload()).status).toBe(429);
      expect(await viewCount(app, id)).toBe(10);
    });

    it("leaves another visitor's budget alone", async () => {
      const { slug } = await publishPage(app);

      for (let attempt = 0; attempt < 10; attempt += 1) {
        expect((await postView(app, slug, {}, { "User-Agent": "budget-agent-a" })).status).toBe(201);
      }

      expect((await postView(app, slug, {}, { "User-Agent": "budget-agent-b" })).status).toBe(201);
    });

    /* The address is the only thing the server can add to what the page sent, and it must reach the hash. */
    it("reads the visitor from the forwarded address", async () => {
      const { id, slug } = await publishPage(app);

      await postView(
        app,
        slug,
        {},
        { "User-Agent": "forwarded-agent", "X-Forwarded-For": "198.51.100.9" },
      ).expect(201);

      const [row] = await app.get(DataSource).getRepository(PageView).find({ where: { linkId: id } });

      expect(row.visitorHash).toBe(
        visitorHashOf({ ip: "198.51.100.9", userAgent: "forwarded-agent", at: new Date() }),
      );
    });
  });
});
