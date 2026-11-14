# Backend Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the API the three things the block catalog needs from the server: safe uploads (with size and type limits, and non-image assets), per-block click analytics, and form submissions the owner can read.

**Architecture:** Each feature is an entity plus a migration, a guard on the public read path, a DTO validated by the existing global `ValidationPipe`, and the thinnest possible controller. Public write endpoints are the only unauthenticated mutators in the system, so each one carries its own limit: a small in-module sliding-window counter keyed by link and block, plus a honeypot where a form is involved. Nothing here trusts the client with a value the server can derive.

**Tech Stack:** NestJS with `class-validator`, TypeORM over better-sqlite3, multer through `FileInterceptor`, vitest + supertest against the in-memory database (`apps/backend/test/`), Bruno collection in `apps/backend/.bruno` for real HTTP and file behaviour.

**Spec:** [`../specs/2026-11-13-block-catalog-design.md`](../specs/2026-11-13-block-catalog-design.md)

## Global Constraints

- Backend schema changes go through migrations in `apps/backend/src/migrations/`, generated against a migrated database; `synchronize` is off.
- Environment variables are read at their point of use with an inline default, the way `UPLOADS_PATH`, `IMAGES_PATH` and `JWT_SECRET` already are.
- The global `ValidationPipe` runs with `whitelist` and `forbidNonWhitelisted`: an unknown field is a 400, so every DTO must name its fields.
- Rejected uploads leave nothing on disk. Nothing is written before its type and size are accepted.
- Public endpoints touch only published pages (`LinkStatus.PUBLISHED`), never drafts, and never echo whether a slug exists for an unpublished page.
- No events table field may store an IP address, a user agent or any per-visitor identifier.
- `lint`/`fmt` read-only; write with `lint:fix`/`fmt:write`. Conventional commits, one commit per task. No version numbers in docs.

## Review Focus

- Two visitors click the same block within the same second: both clicks count, and neither is lost to a race on a counter row; T3 pins the aggregate over concurrent requests.
- A crafted upload with a correct-looking extension but a wrong or missing mimetype is the classic bypass; T1 and T2 pin server-side rejection by declared type and by extension derivation, not by file name.
- A file larger than the limit must be refused before a byte reaches the uploads directory; T1 pins the directory listing, not just the status code.
- Rate limiting a public endpoint must not become a way to lock a legitimate visitor out of the whole link; T3 and T4 pin the window per link and block, and that a rejected request stores nothing.
- Deleting a link must take its files, events and submissions with it, or disks and tables grow forever; T2, T3 and T4 pin cascade behaviour by deleting the link and re-reading.

---

### Task 1: Enforce a size limit on both image upload paths

**Files:**

- Modify: `apps/backend/src/storage/local-storage.service.ts`, `apps/backend/src/storage/storage.controller.ts`
- Modify: `apps/backend/src/users/users.controller.ts`
- Modify: `apps/backend/.env.example` (document the new variable next to the existing storage ones)
- Test: `apps/backend/test/storage.spec.ts`
- Modify: `apps/backend/.bruno/storage/*.bru` (add an oversized request)

**Interfaces:**

- Consumes: `authenticate(app)` from `apps/backend/test/authenticate.ts`, created by `2026-11-13-blocks-foundation.md` Task 2.
- Produces, in `local-storage.service.ts`: `export function maxImageBytes(): number` — `Number(process.env.MAX_IMAGE_BYTES ?? 5 * 1024 * 1024)`, read at call time like the other env values, and `export class UploadTooLargeException extends PayloadTooLargeException` carrying the limit in its message. Keep the value an integer: multer rejects non-integer limits.
- Produces: `POST /storage/images` answering 413 for an oversized file, matching `PUT /users/me/avatar`, which currently uses a hardcoded 5 MB check — replace that with the same `maxImageBytes()`.

- [ ] **Step 1: Write the failing test**

Create `apps/backend/test/storage.spec.ts`:

```ts
const oversized = () => Buffer.alloc(maxImageBytes() + 1, 1);

it("rejects an oversized block image without writing it", async () => {
  const agent = await authenticate(app);
  const before = await readdir(imagesDir());

  const response = await agent.post("/storage/images").attach("file", oversized(), "big.png");

  expect(response.status).toBe(413);
  expect(await readdir(imagesDir())).toEqual(before);
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
  const response = await agent.put("/users/me/avatar").attach("avatar", oversized(), "big.png");

  expect(response.status).toBe(413);
});
```

`imagesDir()` reads `process.env.IMAGES_PATH` (set by `test/setup.ts`); `PNG_BYTES` is a tiny valid PNG byte array in the same file.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm --filter @links/backend test -- test/storage.spec.ts`
Expected: FAIL — the oversized image is accepted with 201, and the avatar answers 400 rather than 413.

- [ ] **Step 3: Add the limit to the service and both controllers**

`FileInterceptor("file", { limits: { fileSize: maxImageBytes() } })` on `POST /storage/images`, and the same for `"avatar"` on `PUT /users/me/avatar`. Because multer's own rejection surfaces as a 500, add an exception filter (or a check in the controller before `saveImage`) that turns an oversized upload into `UploadTooLargeException` — 413 — and never calls `saveImage`/`saveAvatar` for it. Delete the hardcoded `5 * 1024 * 1024` comparison from `users.controller.ts` in favour of `maxImageBytes()`.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @links/backend test -- test/storage.spec.ts`
Expected: PASS, three tests, uploads directory unchanged after both rejections.

- [ ] **Step 5: Record it in the Bruno collection and the env example**

Add `apps/backend/.bruno/storage/upload-oversized.bru` posting a generated file above the limit and asserting `res.status: eq 413`. Add `MAX_IMAGE_BYTES=` to `apps/backend/.env.example` beside the storage paths with a one-line comment.

- [ ] **Step 6: Verify against a running server**

Run the backend, execute the collection folder `storage`, and confirm both the small upload and the rejection come back as the tests expect.

- [ ] **Step 7: Commit**

```bash
git add apps/backend/src apps/backend/test apps/backend/.bruno apps/backend/.env.example
git commit -m "fix(backend): enforce an upload size limit on block images"
```

### Task 2: Non-image assets with a mimetype allowlist

**Files:**

- Modify: `apps/backend/src/storage/local-storage.service.ts`, `apps/backend/src/storage/storage.controller.ts`, `apps/backend/src/storage/storage.module.ts`
- Create: `apps/backend/src/storage/block-asset.entity.ts`
- Create: `apps/backend/src/migrations/<timestamp>-add-block-assets.ts` (generated)
- Modify: `apps/backend/src/links/links.service.ts` (asset sync beside image sync)
- Modify: `apps/web/src/shared/api/backend/storage/upload-image.ts`, `.../url.ts`, `.../index.ts`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/image-field.vue` (accept per property)
- Test: `apps/backend/test/storage.spec.ts`

**Interfaces:**

- Produces, in `local-storage.service.ts`:
  - `export const ASSET_MIME_EXTENSIONS = { "video/mp4": ".mp4", "video/webm": ".webm", "audio/mpeg": ".mp3", "audio/ogg": ".ogg", "audio/mp4": ".m4a", "application/pdf": ".pdf" } as const;`
  - `export function maxAssetBytes(mimetype: string): number` — `MAX_VIDEO_BYTES` (default 50 MB) for `video/*`, `MAX_AUDIO_BYTES` (default 20 MB) for `audio/*`, `MAX_DOCUMENT_BYTES` (default 20 MB) otherwise.
  - `async saveAsset(file: Express.Multer.File): Promise<string>` and `removeAsset(fileId)`, `assetPath(fileId)` — same shape as the image methods, writing under `ASSETS_PATH ?? "uploads/assets"`, deriving the extension **only** from `ASSET_MIME_EXTENSIONS` (never from `originalname`).
  - The image path keeps its current `extensionFor` fallback only for known image types; an unknown mimetype is rejected instead of falling back to the uploader's extension.
- Produces: `BlockAsset` entity (`fileId`, `link` many-to-one with cascade delete) and migration.
- Produces: `POST /storage/assets` (multipart `file`), `GET /storage/assets/:fileId` (Range-capable via `res.sendFile`), `DELETE /storage/assets/:fileId`.
- Produces, in the web API: `uploadAsset(file: File): Promise<string>`, `resolveAssetUrl(fileId, { origin }): string | undefined`.

- [ ] **Step 1: Write the failing tests**

Extend `apps/backend/test/storage.spec.ts`:

```ts
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

it("rejects a disallowed type even when the file name lies", async () => {
  const agent = await authenticate(app);
  const response = await agent.post("/storage/assets").attach("file", Buffer.from("<svg/>"), "evil.mp4");

  expect(response.status).toBe(400);
});

it("rejects an asset above its type limit", async () => {
  const agent = await authenticate(app);
  const response = await agent
    .post("/storage/assets")
    .attach("file", Buffer.alloc(maxAssetBytes("video/mp4") + 1, 1), "big.mp4");

  expect(response.status).toBe(413);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @links/backend test -- test/storage.spec.ts`
Expected: FAIL — `/storage/assets` is 404.

- [ ] **Step 3: Implement the service, entity and endpoints**

As in **Interfaces**. The controller checks `file.mimetype` against `ASSET_MIME_EXTENSIONS` before calling `saveAsset` and throws `BadRequestException` otherwise; multer's `fileFilter` provides the same check earlier so nothing is buffered for a rejected type. Register `BlockAsset` in `StorageModule.forFeature` and export it the way `BlockImage` is exported.

- [ ] **Step 4: Generate and run the migration**

```bash
pnpm --filter @links/backend migration:run
pnpm --filter @links/backend migration:generate src/migrations/AddBlockAssets
pnpm --filter @links/backend migration:run
```

Expected: a `block_assets` table with a foreign key onto `links`.

- [ ] **Step 5: Run the suite**

Run: `pnpm --filter @links/backend test`
Expected: PASS, including the existing `app.spec.ts` smoke test.

- [ ] **Step 6: Tie assets to the link and delete them with it**

Generalise `syncImages` in `links.service.ts` into one `syncAttachments(link, imageFileIds, assetFileIds)` covering both tables, with the same add/remove diff it does today. Extend the web store's `collectImageFileIds` into `collectAttachmentFileIds(blocks)` returning `{ imageFileIds, assetFileIds }` by property `type`, and send `assetFileIds` on save. Extend `UpdateContentDto` with `@IsOptional() @IsArray() @IsString({ each: true }) assetFileIds?: string[]`.

- [ ] **Step 7: Verify deletion cascades**

Upload an asset, attach it to a block, save, then delete the link. Expected: the row in `block_assets` is gone and the file is missing from the assets directory. Prove it in the test file, not by hand only.

- [ ] **Step 8: Commit**

```bash
git add apps/backend/src apps/backend/test apps/web/src
git commit -m "feat(backend): accept video, audio and pdf assets with a mimetype allowlist"
```

### Task 3: Per-block click analytics

**Files:**

- Create: `apps/backend/src/analytics/block-event.entity.ts`, `analytics.service.ts`, `analytics.module.ts`, `dto/block-event.dto.ts`
- Create: `apps/backend/src/public/public-events.controller.ts` (or extend `public-links.controller.ts`)
- Create: `apps/backend/src/migrations/<timestamp>-add-block-events.ts` (generated)
- Modify: `apps/backend/src/app.module.ts`, `apps/backend/src/links/links.controller.ts`, `apps/backend/src/links/links.module.ts`
- Modify: `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.vue`, `apps/web/src/pages/[link]/ui/link-page.vue`
- Create: `apps/web/src/widgets/multilinks-constructor/ui/block-stats/block-stats.vue`
- Test: `apps/backend/test/analytics.spec.ts`, `apps/web/src/shared/blocks/analytics.test.ts`

**Interfaces:**

- Produces: `BlockEvent` entity — `id` uuid, `linkId` uuid, `blockId` string, `kind` (`"click" | "view"`), `createdAt`.
- Produces: `POST /public/links/:slug/events` with `RecordBlockEventDto { blockId: string; kind: "click" | "view" }`; 201 on record, 404 for an unpublished or unknown slug, 429 when the window is exhausted, 400 for an unknown field.
- Produces: `GET /links/:id/stats?from=&to=` returning `{ blocks: { blockId: string; clicks: number; views: number }[] }`, authenticated and owner-scoped.
- Produces, in the web: `export function trackBlockEvent(input: { slug: string; blockId: string; kind: "click" | "view"; origin: string }): void` — a `navigator.sendBeacon` post with a JSON blob, silent on failure.
- Produces, in `LinkPageRenderer`: `data-block-id` on every rendered block wrapper and one delegated click listener.

- [ ] **Step 1: Write the failing API test**

Create `apps/backend/test/analytics.spec.ts`:

```ts
it("records a click for a published page and aggregates it for the owner", async () => {
  const { agent, slug } = await publishPage(app);

  expect(
    (await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" }))
      .status,
  ).toBe(201);

  const stats = await agent.get(`/links/${await linkId(app, agent, slug)}/stats`);
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

it("exhausts the window without storing the rejected requests", async () => {
  const { slug } = await publishPage(app);
  const post = () =>
    request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" });

  const statuses = await Promise.all(Array.from({ length: 70 }, post));

  expect(statuses.filter((s) => s.status === 201).length).toBeLessThanOrEqual(60);
  expect(statuses.some((s) => s.status === 429)).toBe(true);
});

it("keeps another user's stats out of reach", async () => {
  const owner = await publishPage(app);
  const stranger = await authenticate(app);
  const id = await linkId(app, owner.agent, owner.slug);

  expect((await stranger.get(`/links/${id}/stats`)).status).toBe(404);
});

it("deletes events with the link", async () => {
  const { agent, slug } = await publishPage(app);
  const id = await linkId(app, agent, slug);
  await request(app.getHttpServer()).post(`/public/links/${slug}/events`).send({ blockId: "b1", kind: "click" });

  await agent.delete(`/links/${id}`);
  expect(await eventCount(app)).toBe(0);
});
```

Helpers `publishPage`, `draftPage`, `linkId` and `eventCount` live in the same file: the first two register a user, create a link and patch its status; `eventCount` reads the repository through `app.get(DataSource)`.

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @links/backend test -- test/analytics.spec.ts`
Expected: FAIL — the endpoint is 404.

- [ ] **Step 3: Implement entity, migration, service and endpoints**

Entity and migration as in **Interfaces**. `AnalyticsService` holds a `Map<string, number[]>` of recent timestamps keyed by `${linkId}:${blockId}`, prunes entries older than 60 seconds, caps at 60 events per window and throws `ThrottlerException` when exceeded. `record()` inserts one row per accepted event (no counter row to race on). `stats(owner, linkId, from, to)` runs one grouped query through the repository's `createQueryBuilder` and verifies ownership through `LinksService.getOwned` first. Register the module in `app.module.ts` and the owner route in `links.controller.ts`.

- [ ] **Step 4: Run the API suite to verify it passes**

Run: `pnpm --filter @links/backend test -- test/analytics.spec.ts`
Expected: PASS, five tests.

- [ ] **Step 5: Write the failing web test**

Create `apps/web/src/shared/blocks/analytics.test.ts` asserting that `trackBlockEvent` calls `navigator.sendBeacon` once with the `/public/links/<slug>/events` URL and a blob whose parsed body is `{ blockId, kind }`, and that it does not throw when `sendBeacon` is undefined.

- [ ] **Step 6: Render block ids and send clicks**

`LinkPageRenderer` wraps each block in a `<div :data-block-id="block.id">` and attaches one listener on the container: on click, walk up to the nearest `[data-block-id]` and call `trackBlockEvent` with the slug from props. `pages/[link]/ui/link-page.vue` passes `slug`. No listener per block, no inline handlers.

- [ ] **Step 7: Show counters in the constructor**

`block-stats.vue` fetches `GET /links/:id/stats` when the constructor opens and renders `clicks`/`views` for the selected block in a new `OptionsSection` inside `block-properties-editor.vue`. Absent data renders as `0`, not a spinner forever.

- [ ] **Step 8: Verify end to end in a browser**

Publish a page, click two different links, reload the constructor: counters match the clicks. Then post 70 events with a script and confirm the tail is 429 and the stored count matches the accepted ones.

- [ ] **Step 9: Commit**

```bash
git add apps/backend/src apps/backend/test apps/web/src
git commit -m "feat(backend): record and expose per-block click analytics"
```

### Task 4: Contact form and email capture

**Files:**

- Create: `apps/backend/src/forms/form-submission.entity.ts`, `forms.service.ts`, `forms.module.ts`, `dto/submission.dto.ts`
- Create: `apps/backend/src/public/public-forms.controller.ts`
- Create: `apps/backend/src/migrations/<timestamp>-add-form-submissions.ts` (generated)
- Modify: `apps/backend/src/app.module.ts`, `apps/backend/src/links/links.controller.ts`, `apps/backend/src/links/links.module.ts`
- Create: `packages/blocks/src/blocks/contact-form.ts`, `email-capture.ts`
- Create: `apps/web/src/shared/blocks/components/contact-form-block.vue`, `email-capture-block.vue`
- Create: `apps/web/src/shared/api/backend/public/submit-form.ts`
- Create: `apps/web/src/widgets/multilinks-constructor/ui/submissions-list/submissions-list.vue`
- Test: `apps/backend/test/forms.spec.ts`

**Interfaces:**

- Produces: `FormSubmission` entity — `id` uuid, `linkId` uuid, `blockId` string, `kind` (`"contact" | "subscribe"`), `payload` simple-json, `createdAt`.
- Produces: `POST /public/links/:slug/submissions` with `CreateSubmissionDto { blockId: string; kind: "contact" | "subscribe"; name?: string (max 100); email: string (IsEmail, max 200); message?: string (max 2000); website?: string }` — `website` is the honeypot and is dropped, never stored. 201 with `{ ok: true }` for both a real submission and a honeypot hit; 400 for a bad email, a missing required field or an over-long value; 404 for an unpublished slug; 429 past the window.
- Produces: `GET /links/:id/submissions?blockId=&limit=` returning `{ submissions: { id, blockId, kind, payload, createdAt }[] }`, owner-scoped, newest first.
- Produces: `ContactForm` block — `title`, `description`, `button-label` (default "Send"), `success-message` (default "Thank you, we will get back to you"), `fields` (select multiple of name | email | message, default all). `EmailCapture` block — `title`, `placeholder` (default "Your email"), `button-label` (default "Subscribe"), `success-message`.

- [ ] **Step 1: Write the failing API test**

Create `apps/backend/test/forms.spec.ts` with five cases: a valid contact submission is stored and readable by the owner; an invalid email is a 400; an over-long message is a 400; a honeypot hit answers 201 and stores nothing; a stranger cannot read another link's submissions (404); submissions are deleted with the link. Use the same `publishPage` helper shape as the analytics spec.

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @links/backend test -- test/forms.spec.ts`
Expected: FAIL — the endpoint is 404.

- [ ] **Step 3: Implement entity, migration, service and endpoints**

Mirror Task 3: entity + generated migration, `FormsService` with the same sliding-window limiter (30 per minute per link), `create()` inserting a row unless `website` is non-empty, `list()` verifying ownership through `getOwned` before querying. Register module and owner route.

- [ ] **Step 4: Run the API suite to verify it passes**

Run: `pnpm --filter @links/backend test -- test/forms.spec.ts`
Expected: PASS, six tests.

- [ ] **Step 5: Add the two blocks**

Schemas as in **Interfaces**, metadata (`Commerce`, `i-lucide:mail` and `i-lucide:at-sign`), fixtures in `packages/blocks/test/`, contract suite green.

- [ ] **Step 6: Build the form components**

Each renders a `<form>` with a hidden honeypot input named `website`, a `UILabel`/`UIInput` per configured field, and a `UIButton` submit. Submit posts through `submitForm({ slug, blockId, kind, ...values })`, disables the button while in flight, and swaps the form for `success-message` on success or an inline error on failure. The slug comes from `useRoute().params.link`.

- [ ] **Step 7: Show submissions in the constructor**

`submissions-list.vue` fetches `GET /links/:id/submissions` for the selected block and renders date, email and message; empty state says there are none yet. Mount it inside the block properties editor for the two form blocks only.

- [ ] **Step 8: Verify end to end in a browser**

Submit a real message on a published page and see it in the constructor; submit with the honeypot filled by editing the DOM and confirm nothing appears; confirm no email is sent and say so in the UI copy ("stored in your page", not "sent").

- [ ] **Step 9: Commit**

```bash
git add apps/backend/src apps/backend/test packages/blocks apps/web/src
git commit -m "feat(backend): store contact and email-capture submissions"
```
