import type { INestApplication } from "@nestjs/common";

import { mkdir, readdir } from "node:fs/promises";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { maxImageBytes } from "../src/storage/local-storage.service";
import { authenticate } from "./authenticate";
import { createTestApp } from "./create-test-app";

/** A 1x1 PNG, so the storage service derives `.png` from the mimetype and serves it back as one. */
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

function uploadDir(variable: "IMAGES_PATH" | "UPLOADS_PATH") {
  const path = process.env[variable];
  if (!path) throw new Error(`${variable} is not set — test/setup.ts owns it.`);

  return path;
}

const imagesDir = () => uploadDir("IMAGES_PATH");
const avatarsDir = () => uploadDir("UPLOADS_PATH");
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

  it("rejects an oversized avatar with 413", async () => {
    const agent = await authenticate(app);
    const before = await readdir(avatarsDir());

    const response = await agent.put("/users/me/avatar").attach("avatar", oversized(), "big.png");

    expect(response.status).toBe(413);
    expect(await readdir(avatarsDir())).toEqual(before);
  });
});

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
});
