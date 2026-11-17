import type { INestApplication } from "@nestjs/common";

import { randomUUID } from "node:crypto";
import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { FormSubmission } from "../src/forms/form-submission.entity";
import { LinkStatus } from "../src/links/link-status";
import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

type Agent = Awaited<ReturnType<typeof authenticate>>;

/** The id the owner's list reports for a slug, which is how a page is addressed from the authenticated side. */
async function linkId(agent: Agent, slug: string) {
  const { body } = await agent.get("/links").expect(200);
  const link = (body as { id: string; slug: string }[]).find((candidate) => candidate.slug === slug);

  if (!link) throw new Error(`no link for ${slug}`);

  return link.id;
}

/** The stored page content the public endpoint reads block ids from: a page with no forms takes none. */
const pageBlocks = [
  { id: "b1", name: "ContactForm", properties: {} },
  { id: "b2", name: "EmailCapture", properties: {} },
];

/** A page owned by a fresh account, already moved to `status`. Each test gets its own page. */
async function pageWithStatus(app: INestApplication, status: LinkStatus, blocks: unknown[] = pageBlocks) {
  const agent = await authenticate(app);
  const slug = `page-${randomUUID().slice(0, 8)}`;

  const created = await agent.post("/links").send({ slug, title: "Forms test page" }).expect(201);
  await agent.patch(`/links/${created.body.id}/content`).send({ blocks, status }).expect(200);

  return { agent, id: created.body.id as string, slug };
}

const publishPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.PUBLISHED);
const draftPage = (app: INestApplication) => pageWithStatus(app, LinkStatus.DRAFT);

const contact = { blockId: "b1", kind: "contact", name: "Ada", email: "ada@example.com", message: "Hello there" };

/** The one public write these tests exercise. */
const postSubmission = (app: INestApplication, slug: string, body: Record<string, unknown>) =>
  request(app.getHttpServer()).post(`/public/links/${slug}/submissions`).send(body);

/** Rows one page holds: the suite shares a database, so a bare count would see other tests' rows. */
async function submissionCount(app: INestApplication, id: string) {
  return app
    .get(DataSource)
    .getRepository(FormSubmission)
    .count({ where: { linkId: id } });
}

describe("form submissions", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("stores a contact submission and lists it for the owner, newest first", async () => {
    const { agent, slug } = await publishPage(app);

    expect((await postSubmission(app, slug, contact)).status).toBe(201);

    const listed = await agent.get(`/links/${await linkId(agent, slug)}/submissions`).query({ blockId: "b1" });
    expect(listed.status).toBe(200);
    expect(listed.body.submissions).toHaveLength(1);
    expect(listed.body.submissions[0]).toMatchObject({
      blockId: "b1",
      kind: "contact",
      payload: { name: "Ada", email: "ada@example.com", message: "Hello there" },
    });

    /* The row the public form sent is the row the owner reads: nothing is rewritten on the way in. */
    expect((await postSubmission(app, slug, { ...contact, message: "Second" })).status).toBe(201);

    const both = await agent.get(`/links/${await linkId(agent, slug)}/submissions`).query({ blockId: "b1" });
    expect(both.body.submissions.map((row: { payload: { message: string } }) => row.payload.message)).toEqual([
      "Second",
      "Hello there",
    ]);
  });

  /* A browser posts the honeypot as an empty string: the row keeps what the visitor filled in, nothing else. */
  it("stores only the fields the form sent", async () => {
    const { agent, slug } = await publishPage(app);
    await postSubmission(app, slug, {
      blockId: "b2",
      kind: "subscribe",
      email: "ada@example.com",
      company: "",
    }).expect(201);

    const { body } = await agent.get(`/links/${await linkId(agent, slug)}/submissions`).expect(200);

    expect(body.submissions[0].payload).toEqual({ email: "ada@example.com" });
  });

  it("refuses an invalid email and an over-long message", async () => {
    const { id, slug } = await publishPage(app);

    expect((await postSubmission(app, slug, { ...contact, email: "not-an-email" })).status).toBe(400);
    expect((await postSubmission(app, slug, { ...contact, message: "x".repeat(2001) })).status).toBe(400);
    expect((await postSubmission(app, slug, { blockId: "b1", kind: "contact" })).status).toBe(400);
    /* Every field is named in the DTO, so anything else the client sends is refused rather than stored. */
    expect((await postSubmission(app, slug, { ...contact, ip: "1.2.3.4" })).status).toBe(400);

    expect(await submissionCount(app, id)).toBe(0);
  });

  /*
    The honeypot is a field only a bot fills. Answering 201 with an error would tell it what gave it away,
    so the request looks accepted and leaves no row behind.
  */
  it("answers 201 for a honeypot hit and stores nothing", async () => {
    const { id, slug } = await publishPage(app);

    expect((await postSubmission(app, slug, { ...contact, company: "Spam Ltd" })).status).toBe(201);
    expect(await submissionCount(app, id)).toBe(0);
  });

  /* The id is a stored row and a window key: one the page does not hold may be neither. */
  it("refuses a block the page does not hold", async () => {
    const { id, slug } = await publishPage(app);

    expect((await postSubmission(app, slug, { ...contact, blockId: "not-a-block" })).status).toBe(400);
    expect(await submissionCount(app, id)).toBe(0);
  });

  it("refuses a draft page and a slug no page holds", async () => {
    const { slug } = await draftPage(app);

    expect((await postSubmission(app, slug, contact)).status).toBe(404);
    expect((await postSubmission(app, "no-such-page", contact)).status).toBe(404);
  });

  it("exhausts the window without storing the rejected requests", async () => {
    const { id, slug } = await publishPage(app);

    const responses = await Promise.all(Array.from({ length: 40 }, () => postSubmission(app, slug, contact)));
    const accepted = responses.filter((response) => response.status === 201).length;

    expect(accepted).toBe(30);
    expect(responses.some((response) => response.status === 429)).toBe(true);
    expect(await submissionCount(app, id)).toBe(accepted);
  });

  /*
    The window belongs to the form, not the page: a page with two forms has two budgets, so a flood on one
    must not lock visitors out of the other.
  */
  it("keeps one busy form from silencing the rest of the page", async () => {
    const { id, slug } = await publishPage(app);

    const first = await Promise.all(Array.from({ length: 30 }, () => postSubmission(app, slug, contact)));
    expect(first.map((response) => response.status)).toEqual(Array<number>(30).fill(201));

    const second = await Promise.all(
      Array.from({ length: 30 }, () =>
        postSubmission(app, slug, { blockId: "b2", kind: "subscribe", email: "ada@example.com" }),
      ),
    );
    expect(second.map((response) => response.status)).toEqual(Array<number>(30).fill(201));

    expect(await submissionCount(app, id)).toBe(60);
  });

  /*
    A form's own budget says nothing about a page built from many forms: without a page ceiling, eleven
    forms would take eleven budgets, and nothing prunes the table they write.
  */
  it("caps a page's submissions whatever its form count", async () => {
    const forms = Array.from({ length: 11 }, (_, index) => ({
      id: `b${index + 1}`,
      name: "ContactForm",
      properties: {},
    }));
    const { id, slug } = await pageWithStatus(app, LinkStatus.PUBLISHED, forms);

    for (const block of forms.slice(0, 10)) {
      const responses = await Promise.all(
        Array.from({ length: 30 }, () => postSubmission(app, slug, { ...contact, blockId: block.id })),
      );
      expect(responses.every((response) => response.status === 201)).toBe(true);
    }

    expect((await postSubmission(app, slug, { ...contact, blockId: "b11" })).status).toBe(429);
    expect(await submissionCount(app, id)).toBe(300);
  });

  it("keeps another user's submissions out of reach", async () => {
    const owner = await publishPage(app);
    const stranger = await authenticate(app);
    await postSubmission(app, owner.slug, contact).expect(201);

    expect((await stranger.get(`/links/${await linkId(owner.agent, owner.slug)}/submissions`)).status).toBe(404);
  });

  it("deletes submissions with the link", async () => {
    const { agent, slug } = await publishPage(app);
    const id = await linkId(agent, slug);
    await postSubmission(app, slug, contact).expect(201);

    expect(await submissionCount(app, id)).toBe(1);

    await agent.delete(`/links/${id}`).expect(204);

    expect(await submissionCount(app, id)).toBe(0);
  });
});
