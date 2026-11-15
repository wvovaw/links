import type { INestApplication } from "@nestjs/common";

import { NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import request from "supertest";
import { DataSource } from "typeorm";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { LocalStorageService, maxAssetBytes, maxImageBytes } from "../src/storage/local-storage.service";
import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

/** A 1x1 PNG, so the storage service derives `.png` from the mimetype and serves it back as one. */
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

/** An `ftyp` box at the head of the file, which is what makes a served `.mp4` a `video/mp4`. */
const MP4_BYTES = Buffer.from("00000018667479706d703432000000006d70343269736f6d", "hex");

function uploadDir(variable: "IMAGES_PATH" | "UPLOADS_PATH" | "ASSETS_PATH") {
  const path = process.env[variable];
  if (!path) throw new Error(`${variable} is not set — test/setup.ts owns it.`);

  return path;
}

const imagesDir = () => uploadDir("IMAGES_PATH");
const avatarsDir = () => uploadDir("UPLOADS_PATH");
const assetsDir = () => uploadDir("ASSETS_PATH");
const oversized = () => Buffer.alloc(maxImageBytes() + 1, 1);

describe("image uploads", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    // The service creates these on the first save; the rejections below must leave them empty.
    await mkdir(imagesDir(), { recursive: true });
    await mkdir(avatarsDir(), { recursive: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects an oversized block image without writing it", async () => {
    const agent = await authenticate(app);
    const before = await readdir(imagesDir());

    const response = await agent.post("/storage/images").attach("file", oversized(), "big.png");

    expect(response.status).toBe(413);
    expect(await readdir(imagesDir())).toEqual(before);
  });

  it("enforces a MAX_IMAGE_BYTES set at request time", async () => {
    const original = process.env.MAX_IMAGE_BYTES;
    process.env.MAX_IMAGE_BYTES = "1024";

    try {
      const agent = await authenticate(app);
      const before = await readdir(imagesDir());

      const response = await agent.post("/storage/images").attach("file", Buffer.alloc(2048, 1), "two-kb.png");

      expect(response.status).toBe(413);
      expect(response.body.message).toContain("1024 bytes");
      expect(await readdir(imagesDir())).toEqual(before);
    } finally {
      if (original === undefined) delete process.env.MAX_IMAGE_BYTES;
      else process.env.MAX_IMAGE_BYTES = original;
    }
  });

  it("accepts a small image and serves it back", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/storage/images").attach("file", Buffer.from(PNG_BYTES), "small.png");

    expect(created.status).toBe(201);

    const served = await request(app.getHttpServer()).get(`/storage/images/${created.body.fileId}`);

    expect(served.status).toBe(200);
    expect(served.headers["content-type"]).toContain("image/png");
  });

  /*
    A stored file's type comes from the mimetype the client declared, never from the name it chose:
    a name ending in `.png` does not make an svg an image this API stores.
  */
  it("rejects an image of an unsupported type instead of keeping its name", async () => {
    const agent = await authenticate(app);
    const before = await readdir(imagesDir());

    const response = await agent
      .post("/storage/images")
      .attach("file", Buffer.from("<svg/>"), { filename: "evil.png", contentType: "image/svg+xml" });

    expect(response.status).toBe(400);
    expect(await readdir(imagesDir())).toEqual(before);
  });

  /* An uploaded image belongs to its uploader before any page names it, so deleting it early still works. */
  it("deletes an image its uploader uploaded, before a page names it", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/storage/images").attach("file", Buffer.from(PNG_BYTES), "mine.png").expect(201);

    expect((await agent.delete(`/storage/images/${created.body.fileId}`)).status).toBe(204);
    expect(await readdir(imagesDir())).not.toContain(created.body.fileId);
  });

  /*
    An image id is visible on a published page and the GET is public, so an unscoped delete let any
    registered user empty another owner's page. The stranger gets the same 404 an unknown id gets.
  */
  it("keeps another owner's image out of reach", async () => {
    const owner = await authenticate(app);
    const created = await owner
      .post("/storage/images")
      .attach("file", Buffer.from(PNG_BYTES), "theirs.png")
      .expect(201);
    const stranger = await authenticate(app);

    expect((await stranger.delete(`/storage/images/${created.body.fileId}`)).status).toBe(404);
    expect(await readdir(imagesDir())).toContain(created.body.fileId);

    await owner.delete(`/storage/images/${created.body.fileId}`).expect(204);
  });

  /*
    The attack the upload record closes: a stranger reads a published page's image id and names it on
    their own page. Naming a file is what lets the delete paths reach its bytes.
  */
  it("refuses an image id its page's owner did not upload", async () => {
    const owner = await authenticate(app);
    const victim = await owner.post("/storage/images").attach("file", Buffer.from(PNG_BYTES), "victim.png").expect(201);
    const stranger = await authenticate(app);
    const page = await stranger
      .post("/links")
      .send({ slug: `image-claim-${randomUUID()}`, title: "A page for a claim" })
      .expect(201);

    const response = await stranger
      .patch(`/links/${page.body.id}/content`)
      .send({ imageFileIds: [victim.body.fileId] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("You can only attach files you uploaded.");
    expect(await claimedFiles(app, "block_images", page.body.id)).toEqual([]);

    await owner.delete(`/storage/images/${victim.body.fileId}`).expect(204);
  });

  it("rejects an oversized avatar with 413", async () => {
    const agent = await authenticate(app);
    const before = await readdir(avatarsDir());

    const response = await agent.put("/users/me/avatar").attach("avatar", oversized(), "big.png");

    expect(response.status).toBe(413);
    expect(await readdir(avatarsDir())).toEqual(before);
  });
});

describe("asset uploads", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();

    await mkdir(assetsDir(), { recursive: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it("stores an mp4 and serves it with range support", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/storage/assets").attach("file", Buffer.from(MP4_BYTES), "clip.mp4");

    expect(created.status).toBe(201);

    const ranged = await request(app.getHttpServer())
      .get(`/storage/assets/${created.body.fileId}`)
      .set("Range", "bytes=0-1");

    expect(ranged.status).toBe(206);
    expect(ranged.headers["content-type"]).toContain("video/mp4");
  });

  /*
    The name is the uploader's to choose, so it proves nothing: a video declared under a `.mp4` name
    but sent as an image is refused by the declared type, and nothing reaches the assets directory.
  */
  it("rejects a disallowed type even when the file name lies", async () => {
    const agent = await authenticate(app);
    const before = await readdir(assetsDir());

    const response = await agent
      .post("/storage/assets")
      .attach("file", Buffer.from("<svg/>"), { filename: "evil.mp4", contentType: "image/svg+xml" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Unsupported asset type.");
    expect(await readdir(assetsDir())).toEqual(before);
  });

  it("rejects an asset above its type limit", async () => {
    const agent = await authenticate(app);
    const before = await readdir(assetsDir());

    const response = await agent
      .post("/storage/assets")
      .attach("file", Buffer.alloc(maxAssetBytes("video/mp4") + 1, 1), "big.mp4");

    expect(response.status).toBe(413);
    expect(await readdir(assetsDir())).toEqual(before);
  });

  /* Each kind of asset answers to its own variable: an audio clip over `MAX_AUDIO_BYTES` is refused
     while a video of the same size still passes the much larger video limit. */
  it("enforces a per-type limit set at request time", async () => {
    const original = process.env.MAX_AUDIO_BYTES;
    process.env.MAX_AUDIO_BYTES = "1024";

    try {
      const agent = await authenticate(app);
      const before = await readdir(assetsDir());

      const tooBig = await agent
        .post("/storage/assets")
        .attach("file", Buffer.alloc(2048, 1), { filename: "clip.mp3", contentType: "audio/mpeg" });

      expect(tooBig.status).toBe(413);
      expect(tooBig.body.message).toContain("1024 bytes");
      expect(await readdir(assetsDir())).toEqual(before);

      const video = await agent
        .post("/storage/assets")
        .attach("file", Buffer.alloc(2048, 1), { filename: "clip.mp4", contentType: "video/mp4" });

      expect(video.status).toBe(201);
    } finally {
      if (original === undefined) delete process.env.MAX_AUDIO_BYTES;
      else process.env.MAX_AUDIO_BYTES = original;
    }
  });

  it("deletes an asset its own page names", async () => {
    const agent = await authenticate(app);
    const { fileId, linkId } = await ownedAsset(agent);

    expect((await agent.delete(`/storage/assets/${fileId}`)).status).toBe(204);
    expect(await readdir(assetsDir())).not.toContain(fileId);

    /* Deleting the page takes the row with it, so the tests below start from an empty table. */
    await agent.delete(`/links/${linkId}`).expect(204);
  });

  /*
    The attack the upload record closes: a stranger reads a published page's asset id, names it on their
    own page, and then deletes it through the page that now holds it. The claim is refused, so the delete
    has nothing to reach.
  */
  it("refuses an asset id its page's owner did not upload", async () => {
    const owner = await authenticate(app);
    const { fileId, linkId } = await ownedAsset(owner);
    const stranger = await authenticate(app);
    const page = await stranger
      .post("/links")
      .send({ slug: `asset-claim-${randomUUID()}`, title: "A page for a claim" })
      .expect(201);

    const response = await stranger.patch(`/links/${page.body.id}/content`).send({ assetFileIds: [fileId] });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("You can only attach files you uploaded.");
    expect(await claimedFiles(app, "block_assets", page.body.id)).toEqual([]);
    expect(await assetRows(app)).toContain(fileId);

    await owner.delete(`/links/${linkId}`).expect(204);
  });

  /*
    A stored file with no upload record predates the table, and nothing can say whose it is: it may keep
    the claim a page already holds, but no page may newly claim it.
  */
  it("refuses an id nothing recorded as uploaded", async () => {
    const agent = await authenticate(app);
    const fileId = `${randomUUID()}.mp4`;
    await writeFile(join(assetsDir(), fileId), Buffer.from(MP4_BYTES));
    const page = await agent
      .post("/links")
      .send({ slug: `unrecorded-${randomUUID()}`, title: "A page for a claim" })
      .expect(201);

    const response = await agent.patch(`/links/${page.body.id}/content`).send({ assetFileIds: [fileId] });

    expect(response.status).toBe(400);
    expect(await claimedFiles(app, "block_assets", page.body.id)).toEqual([]);
  });

  /*
    The compatibility rule keeps a claim made before the upload records existed, so removal is where that
    claim must not turn into a way to delete a stranger's bytes: dropping the file from a page removes the
    row, never what the row named.
  */
  it("leaves a recordless file on disk when its page drops it", async () => {
    const victim = await authenticate(app);
    const image = await victim.post("/storage/images").attach("file", Buffer.from(PNG_BYTES), "legacy.png").expect(201);
    const asset = await victim.post("/storage/assets").attach("file", Buffer.from(MP4_BYTES), "legacy.mp4").expect(201);

    const claimant = await authenticate(app);
    const page = await claimant
      .post("/links")
      .send({ slug: `legacy-drop-${randomUUID()}`, title: "A page with a legacy claim" })
      .expect(201);
    await seedRecordlessClaim(app, "block_images", page.body.id, image.body.fileId);
    await seedRecordlessClaim(app, "block_assets", page.body.id, asset.body.fileId);

    expect(
      (await claimant.patch(`/links/${page.body.id}/content`).send({ imageFileIds: [], assetFileIds: [] })).status,
    ).toBe(200);

    expect(await claimedFiles(app, "block_images", page.body.id)).toEqual([]);
    expect(await claimedFiles(app, "block_assets", page.body.id)).toEqual([]);
    expect(await readdir(imagesDir())).toContain(image.body.fileId);
    expect(await readdir(assetsDir())).toContain(asset.body.fileId);
  });

  /* Deleting the page takes its rows; the bytes it named but did not upload are an orphan, not a deletion. */
  it("leaves a recordless file on disk when its page is deleted", async () => {
    const victim = await authenticate(app);
    const image = await victim
      .post("/storage/images")
      .attach("file", Buffer.from(PNG_BYTES), "legacy-cascade.png")
      .expect(201);
    const asset = await victim
      .post("/storage/assets")
      .attach("file", Buffer.from(MP4_BYTES), "legacy-cascade.mp4")
      .expect(201);

    const claimant = await authenticate(app);
    const page = await claimant
      .post("/links")
      .send({ slug: `legacy-cascade-${randomUUID()}`, title: "A page with a legacy claim" })
      .expect(201);
    await seedRecordlessClaim(app, "block_images", page.body.id, image.body.fileId);
    await seedRecordlessClaim(app, "block_assets", page.body.id, asset.body.fileId);

    expect((await claimant.delete(`/links/${page.body.id}`)).status).toBe(204);

    expect(await readdir(imagesDir())).toContain(image.body.fileId);
    expect(await readdir(assetsDir())).toContain(asset.body.fileId);
  });

  /* The record attributes the bytes; when the bytes go, so does it. */
  it("forgets a file's upload record when it deletes the file", async () => {
    const agent = await authenticate(app);
    const created = await agent
      .post("/storage/assets")
      .attach("file", Buffer.from(MP4_BYTES), "attributed.mp4")
      .expect(201);

    expect(await hasUploadRecord(app, created.body.fileId)).toBe(true);

    await agent.delete(`/storage/assets/${created.body.fileId}`).expect(204);

    expect(await hasUploadRecord(app, created.body.fileId)).toBe(false);
  });

  /*
    An asset id is visible on a published page and the GET is public, so the delete has to ask who
    uploaded the file. A stranger gets the same 404 an unknown id gets: the answer confirms nothing, and
    the file and the owner's row are both still there.
  */
  it("keeps another owner's asset out of reach", async () => {
    const owner = await authenticate(app);
    const { fileId, linkId } = await ownedAsset(owner);
    const stranger = await authenticate(app);

    const response = await stranger.delete(`/storage/assets/${fileId}`);

    expect(response.status).toBe(404);
    expect(await readdir(assetsDir())).toContain(fileId);
    expect(await assetRows(app)).toContain(fileId);

    await owner.delete(`/links/${linkId}`).expect(204);
  });

  /*
    A stored id is a plain file name. `..` would resolve to the parent directory, where `access`
    succeeds and `rm` throws — a hostile id must answer 404, never 500.
  */
  it("answers 404 rather than 500 for an id that is not a file name", async () => {
    const agent = await authenticate(app);

    expect((await agent.delete("/storage/assets/%2e%2e")).status).toBe(404);
    expect((await agent.delete("/storage/assets/a%2fb")).status).toBe(404);
    expect((await request(app.getHttpServer()).get("/storage/images/%2e%2e")).status).toBe(404);
  });

  it.each(["..", ".", "", "a/b", "a\\b"])("refuses %j as a stored file name on every root", (fileId) => {
    const storage = app.get(LocalStorageService);

    expect(() => storage.assetPath(fileId)).toThrow(NotFoundException);
    expect(() => storage.imagePath(fileId)).toThrow(NotFoundException);
    expect(() => storage.avatarPath(fileId)).toThrow(NotFoundException);
  });

  it("removes the asset a page no longer names", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/storage/assets").attach("file", Buffer.from(MP4_BYTES), "sync.mp4");
    const fileId = created.body.fileId as string;
    const id = (await agent.post("/links").send({ slug: "asset-sync-page", title: "A page with an asset" })).body
      .id as string;

    expect((await agent.patch(`/links/${id}/content`).send({ assetFileIds: [fileId] })).status).toBe(200);
    expect(await assetRows(app)).toEqual([fileId]);

    expect((await agent.patch(`/links/${id}/content`).send({ assetFileIds: [] })).status).toBe(200);

    expect(await assetRows(app)).toEqual([]);
    expect(await readdir(assetsDir())).not.toContain(fileId);
  });

  /*
    Deleting the link is the one path that has to take its files with it: the row goes through the
    foreign key's cascade, and the file on disk goes because the service deletes it first.
  */
  it("deletes the assets of a link with the link", async () => {
    const agent = await authenticate(app);
    const created = await agent.post("/storage/assets").attach("file", Buffer.from(MP4_BYTES), "cascade.mp4");
    const fileId = created.body.fileId as string;
    const id = (await agent.post("/links").send({ slug: "asset-cascade-page", title: "A page with an asset" })).body
      .id as string;

    await agent
      .patch(`/links/${id}/content`)
      .send({ assetFileIds: [fileId] })
      .expect(200);
    expect((await agent.delete(`/links/${id}`)).status).toBe(204);

    expect(await assetRows(app)).toEqual([]);
    expect(await readdir(assetsDir())).not.toContain(fileId);
  });
});

type Agent = Awaited<ReturnType<typeof authenticate>>;

/**
 * Uploads an asset and names it on a page of the same owner, which is the flow a page builder takes:
 * the upload records who uploaded it, and the page claims it because its owner is that account.
 */
async function ownedAsset(agent: Agent) {
  const created = await agent.post("/storage/assets").attach("file", Buffer.from(MP4_BYTES), "owned.mp4");
  const fileId = created.body.fileId as string;
  const link = await agent
    .post("/links")
    .send({ slug: `asset-owner-${randomUUID()}`, title: "A page with an asset" })
    .expect(201);

  await agent
    .patch(`/links/${link.body.id}/content`)
    .send({ assetFileIds: [fileId] })
    .expect(200);

  return { fileId, linkId: link.body.id as string };
}

/** The file ids one page's attachment table names, read through the connection the app booted with. */
async function claimedFiles(
  app: INestApplication,
  table: "block_images" | "block_assets",
  linkId: string,
): Promise<string[]> {
  const rows: { fileId: string }[] = await app
    .get(DataSource)
    .query(`SELECT fileId FROM ${table} WHERE linkId = ?`, [linkId]);

  return rows.map((row) => row.fileId);
}

/**
 * Seeds what a page stored before `uploaded_files` existed: an attachment row naming a file, with no upload
 * record behind it. The API can no longer create that state — a new claim on an unattributed file is refused —
 * so the row is written straight into the table, which is exactly how such a claim survived the migration.
 */
async function seedRecordlessClaim(
  app: INestApplication,
  table: "block_images" | "block_assets",
  linkId: string,
  fileId: string,
) {
  const dataSource = app.get(DataSource);

  await dataSource.query("DELETE FROM uploaded_files WHERE fileId = ?", [fileId]);
  await dataSource.query(`INSERT INTO ${table} (id, fileId, linkId) VALUES (?, ?, ?)`, [randomUUID(), fileId, linkId]);
}

/** Whether anything still attributes a file to the account that uploaded it. */
async function hasUploadRecord(app: INestApplication, fileId: string): Promise<boolean> {
  const rows: { fileId: string }[] = await app
    .get(DataSource)
    .query("SELECT fileId FROM uploaded_files WHERE fileId = ?", [fileId]);

  return rows.length > 0;
}

/** The `fileId` column of `block_assets`, read through the connection the app booted with. */
async function assetRows(app: INestApplication): Promise<string[]> {
  const rows: { fileId: string }[] = await app.get(DataSource).query("SELECT fileId FROM block_assets ORDER BY fileId");

  return rows.map((row) => row.fileId);
}

describe("maxImageBytes", () => {
  const original = process.env.MAX_IMAGE_BYTES;

  afterEach(() => {
    if (original === undefined) delete process.env.MAX_IMAGE_BYTES;
    else process.env.MAX_IMAGE_BYTES = original;
  });

  it("defaults to 5 MB, reads the override per call and stays an integer", () => {
    delete process.env.MAX_IMAGE_BYTES;
    expect(maxImageBytes()).toBe(5 * 1024 * 1024);

    process.env.MAX_IMAGE_BYTES = "1024.9";
    expect(maxImageBytes()).toBe(1024);
  });

  /*
    multer refuses a `fileSize` that is not a positive integer while the interceptor is being set
    up, which turns a configuration typo into a 500 on every upload. A value that cannot be a limit
    is therefore no setting at all: the default stands.
  */
  it.each(["-1", "0", "0.5", "abc", "Infinity"])("falls back to the default for %s", (unusable) => {
    process.env.MAX_IMAGE_BYTES = unusable;
    expect(maxImageBytes()).toBe(5 * 1024 * 1024);
  });
});

describe("maxAssetBytes", () => {
  const original = { ...process.env };

  afterEach(() => {
    for (const variable of ["MAX_VIDEO_BYTES", "MAX_AUDIO_BYTES", "MAX_DOCUMENT_BYTES"]) {
      if (original[variable] === undefined) delete process.env[variable];
      else process.env[variable] = original[variable];
    }
  });

  it("gives each kind of asset its own default", () => {
    delete process.env.MAX_VIDEO_BYTES;
    delete process.env.MAX_AUDIO_BYTES;
    delete process.env.MAX_DOCUMENT_BYTES;

    expect(maxAssetBytes("video/mp4")).toBe(50 * 1024 * 1024);
    expect(maxAssetBytes("audio/mpeg")).toBe(20 * 1024 * 1024);
    expect(maxAssetBytes("application/pdf")).toBe(20 * 1024 * 1024);
  });

  it("reads each override per call and only for its own kind", () => {
    process.env.MAX_VIDEO_BYTES = "2048";
    process.env.MAX_AUDIO_BYTES = "1024";
    process.env.MAX_DOCUMENT_BYTES = "512";

    expect(maxAssetBytes("video/webm")).toBe(2048);
    expect(maxAssetBytes("audio/ogg")).toBe(1024);
    expect(maxAssetBytes("application/pdf")).toBe(512);
  });

  it.each(["-1", "0", "0.5", "abc", "Infinity"])("falls back to the type default for %s", (zero) => {
    process.env.MAX_VIDEO_BYTES = zero;
    process.env.MAX_AUDIO_BYTES = zero;
    process.env.MAX_DOCUMENT_BYTES = zero;

    expect(maxAssetBytes("video/mp4")).toBe(50 * 1024 * 1024);
    expect(maxAssetBytes("audio/mpeg")).toBe(20 * 1024 * 1024);
    expect(maxAssetBytes("application/pdf")).toBe(20 * 1024 * 1024);
  });
});
