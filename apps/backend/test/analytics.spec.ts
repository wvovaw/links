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
  return app
    .get(DataSource)
    .getRepository(PageView)
    .count({ where: { linkId: id } });
}

/** The id the owner's list reports for a slug, which is how a page is addressed from the public side. */
async function linkId(agent: Agent, slug: string) {
  const { body } = await agent.get("/links").expect(200);
  const link = (body as { id: string; slug: string }[]).find((candidate) => candidate.slug === slug);

  if (!link) throw new Error(`no link for ${slug}`);

  return link.id;
}

/** Today in the UTC the queries group by, which is the day every event written now lands on. */
const today = () => new Date().toISOString().slice(0, 10);

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

    const stats = await agent.get(`/analytics/links/${await linkId(agent, slug)}`);

    expect(stats.body.blocks).toEqual([{ blockId: "b1", clicks: 1, visitors: 1 }]);
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
      agent.get(`/analytics/links/${id}`).query({ ...(from && { from }), ...(to && { to }) });

    expect((await statsIn(hourAgo)).body.blocks).toEqual([{ blockId: "b1", clicks: 1, visitors: 1 }]);
    expect((await statsIn(undefined, hourAgo)).body.blocks).toEqual([]);
    expect((await statsIn(hourAgo, hourAhead)).body.blocks).toEqual([{ blockId: "b1", clicks: 1, visitors: 1 }]);
    expect((await statsIn("yesterday")).status).toBe(400);
  });

  it("keeps another user's stats out of reach", async () => {
    const owner = await publishPage(app);
    const stranger = await authenticate(app);

    expect((await stranger.get(`/analytics/links/${await linkId(owner.agent, owner.slug)}`)).status).toBe(404);
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

  it("stores the source on a click", async () => {
    const { id, slug } = await publishPage(app);

    await request(app.getHttpServer())
      .post(`/public/links/${slug}/events`)
      .set({ "User-Agent": "click-source-agent", "X-Forwarded-For": "198.51.100.31" })
      .send({ blockId: "b1", kind: "click", utmSource: "Telegram" })
      .expect(201);

    const [row] = await app
      .get(DataSource)
      .getRepository(BlockEvent)
      .find({ where: { linkId: id } });

    expect(row.utmSource).toBe("telegram");
    expect(row.visitorHash).toBe(
      visitorHashOf({ ip: "198.51.100.31", userAgent: "click-source-agent", at: new Date() }),
    );
  });

  /*
    Every click already in the table predates the source columns. It must keep counting as a click and as no
    distinct clicker — inventing a hash would report one visitor per legacy block, and deleting the rows
    would erase numbers the owner has already read.
  */
  it("keeps a row written before the source existed", async () => {
    const { agent, slug } = await publishPage(app);
    const id = await linkId(agent, slug);
    const events = app.get(DataSource).getRepository(BlockEvent);

    await events.save(events.create({ linkId: id, blockId: "b1", kind: "click" }));

    const [row] = await events.find({ where: { linkId: id } });

    expect(row.visitorHash).toBeNull();
    expect(row.utmSource).toBeNull();
    expect(row.referrerInternal).toBe(false);
  });

  describe("aggregation", () => {
    const click = (server: INestApplication, slug: string, userAgent: string) =>
      request(server.getHttpServer())
        .post(`/public/links/${slug}/events`)
        .set({ "User-Agent": userAgent })
        .send({ blockId: "b1", kind: "click" });

    it("aggregates views, sources and clicks for one page", async () => {
      const { agent, id, slug } = await publishPage(app);

      const tagged = { utmSource: "telegram", utmMedium: "social" };

      await postView(app, slug, tagged, { "User-Agent": "agg-a" }).expect(201);
      await postView(app, slug, tagged, { "User-Agent": "agg-b" }).expect(201);
      await postView(app, slug, {}, { "User-Agent": "agg-c" }).expect(201);

      await click(app, slug, "agg-a").expect(201);
      await click(app, slug, "agg-b").expect(201);

      const { body } = await agent.get(`/analytics/links/${id}`).expect(200);

      expect(body.totals).toEqual({ views: 3, visitors: 3, clicks: 2 });
      expect(body.blocks).toEqual([{ blockId: "b1", clicks: 2, visitors: 2 }]);
      expect(body.timeseries).toEqual([{ date: today(), views: 3, visitors: 3, clicks: 2 }]);

      /* Visitors count views only: a clicker is a click in this table, never a second visitor. */
      expect(body.sources).toEqual([
        { source: "telegram", medium: "social", views: 2, visitors: 2, clicks: 0 },
        { source: "direct", medium: "direct", views: 1, visitors: 1, clicks: 2 },
      ]);
    });

    /* The hash is the whole visitor count: the same address and agent twice is one person who reloaded. */
    it("counts the same visitor once", async () => {
      const { agent, id, slug } = await publishPage(app);

      await postView(app, slug, {}, { "User-Agent": "same-visitor" }).expect(201);
      await postView(app, slug, {}, { "User-Agent": "same-visitor" }).expect(201);

      expect((await agent.get(`/analytics/links/${id}`)).body.totals).toEqual({ views: 2, visitors: 1, clicks: 0 });
    });

    /* A page nobody opened is the number the owner most needs: zeros, not a 404 and not a blank. */
    it("answers zeros for a page with no traffic", async () => {
      const { agent, slug } = await publishPage(app);

      const { body } = await agent.get(`/analytics/links/${await linkId(agent, slug)}`).expect(200);

      expect(body).toEqual({
        totals: { views: 0, visitors: 0, clicks: 0 },
        timeseries: [],
        sources: [],
        blocks: [],
      });
    });
  });

  describe("overview", () => {
    /** Two published pages under one account, which is what an overview is a summary of. */
    async function twoPages(server: INestApplication) {
      const agent = await authenticate(server);
      const pages: { id: string; slug: string }[] = [];

      for (let index = 0; index < 2; index += 1) {
        const slug = `overview-${randomUUID().slice(0, 8)}`;
        const created = await agent.post("/links").send({ slug, title: slug }).expect(201);

        await agent
          .patch(`/links/${created.body.id}/content`)
          .send({ blocks: pageBlocks, status: LinkStatus.PUBLISHED })
          .expect(200);
        pages.push({ id: created.body.id as string, slug });
      }

      return { agent, pages };
    }

    /* The old address is gone on purpose: one home for analytics reads, with no route-order trap. */
    it("answers the aggregation on the analytics route and nothing on the old one", async () => {
      const { agent, slug } = await publishPage(app);
      const id = await linkId(agent, slug);

      expect((await agent.get(`/analytics/links/${id}`)).status).toBe(200);
      expect((await agent.get(`/links/${id}/stats`)).status).toBe(404);
    });

    it("lists every owned page, including the quiet ones", async () => {
      const { agent, pages } = await twoPages(app);

      await postView(app, pages[0].slug, {}, { "User-Agent": "overview-quiet" }).expect(201);

      const { body } = await agent.get("/analytics/overview").expect(200);

      expect(body.links).toHaveLength(2);
      expect(body.links.find((row: { slug: string }) => row.slug === pages[1].slug)).toEqual({
        id: pages[1].id,
        slug: pages[1].slug,
        title: pages[1].slug,
        views: 0,
        visitors: 0,
        clicks: 0,
      });
      expect(body.totals).toEqual({ views: 1, visitors: 1, clicks: 0 });
    });

    /* One person on two pages is one visitor on the dashboard, and the same day's series says so too. */
    it("counts a visitor across pages once", async () => {
      const { agent, pages } = await twoPages(app);
      const sameVisitor = { "User-Agent": "cross-page-agent", "X-Forwarded-For": "203.0.113.77" };

      await postView(app, pages[0].slug, {}, sameVisitor).expect(201);
      await postView(app, pages[1].slug, {}, sameVisitor).expect(201);

      const { body } = await agent.get("/analytics/overview").expect(200);

      expect(body.totals).toEqual({ views: 2, visitors: 1, clicks: 0 });
      expect(body.timeseries).toEqual([{ date: today(), views: 2, visitors: 1, clicks: 0 }]);
      expect(body.links.map((row: { visitors: number }) => row.visitors)).toEqual([1, 1]);
    });

    it("sums the owner's pages", async () => {
      const { agent, pages } = await twoPages(app);

      await postView(
        app,
        pages[0].slug,
        { utmSource: "tg", utmMedium: "social" },
        { "User-Agent": "overview-a" },
      ).expect(201);
      await postView(app, pages[1].slug, {}, { "User-Agent": "overview-b" }).expect(201);

      const { body } = await agent.get("/analytics/overview").expect(200);

      expect(body.totals).toEqual({ views: 2, visitors: 2, clicks: 0 });
      expect(body.sources).toEqual([
        { source: "direct", medium: "direct", views: 1, visitors: 1, clicks: 0 },
        { source: "tg", medium: "social", views: 1, visitors: 1, clicks: 0 },
      ]);
      expect(body.timeseries).toEqual([{ date: today(), views: 2, visitors: 2, clicks: 0 }]);
    });

    it("keeps another user's pages out", async () => {
      const owner = await twoPages(app);
      const stranger = await authenticate(app);

      await postView(app, owner.pages[0].slug, {}, { "User-Agent": "overview-stranger" }).expect(201);

      const { body } = await stranger.get("/analytics/overview").expect(200);

      expect(body.links).toEqual([]);
      expect(body.totals).toEqual({ views: 0, visitors: 0, clicks: 0 });
      expect((await stranger.get(`/analytics/links/${owner.pages[0].id}`)).status).toBe(404);
    });

    it("answers 401 without a session", async () => {
      expect((await request(app.getHttpServer()).get("/analytics/overview")).status).toBe(401);
      expect((await request(app.getHttpServer()).get("/analytics/links/anything")).status).toBe(401);
    });
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

      const [row] = await app
        .get(DataSource)
        .getRepository(PageView)
        .find({ where: { linkId: id } });

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

    /*
      The reload guard belongs to one page: a visitor opening many pages in a minute is browsing, not
      reloading, and losing those views would make a busy owner's pages look quiet.
    */
    it("keeps one visitor's budget per page", async () => {
      const first = await publishPage(app);
      const second = await publishPage(app);
      const visitor = { "User-Agent": "browsing-agent" };

      for (let attempt = 0; attempt < 6; attempt += 1) {
        expect((await postView(app, first.slug, {}, visitor)).status).toBe(201);
        expect((await postView(app, second.slug, {}, visitor)).status).toBe(201);
      }
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

      await postView(app, slug, {}, { "User-Agent": "forwarded-agent", "X-Forwarded-For": "198.51.100.9" }).expect(201);

      const [row] = await app
        .get(DataSource)
        .getRepository(PageView)
        .find({ where: { linkId: id } });

      expect(row.visitorHash).toBe(visitorHashOf({ ip: "198.51.100.9", userAgent: "forwarded-agent", at: new Date() }));
    });
  });
});
