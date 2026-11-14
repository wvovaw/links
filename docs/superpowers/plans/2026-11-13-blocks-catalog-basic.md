# Block Catalog, Basic Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the eight block types that need no repeatable properties — a link card with a thumbnail, page structure, video and music embeds, social icons, a map, a countdown, a QR code — plus per-block visibility and scheduling.

**Architecture:** Every block here is one schema module in `@links/blocks` and one component in `apps/web/src/shared/blocks/components/`. Anything that turns a user URL into an embed URL, a map URL or an SVG lives in a pure function under `apps/web/src/shared/blocks/`, tested without mounting Vue; components stay thin and only bind those results. `date` is the one new property type, and it arrives with the countdown that needs it.

**Tech Stack:** `@links/blocks` (tsdown, vitest), Vue 3 + Nuxt with UnoCSS (`presetIcons`, `simple-icons` collection added here), vitest + happy-dom.

**Spec:** [`../specs/2026-11-13-block-catalog-design.md`](../specs/2026-11-13-block-catalog-design.md)

## Global Constraints

- One column, always: `.link__container` keeps its stacked layout. No block may escape it.
- Embeds are pure iframes from the allowlist in the spec: YouTube, Vimeo, TikTok (embed-player), Spotify, SoundCloud, Apple Music, Google Maps. No vendor JS SDK, no injected `<script>`, no `srcdoc`.
- Every new block: schema in `packages/blocks/src/blocks/<name>.ts`, component in `apps/web/src/shared/blocks/components/<kebab>-block.vue`, name in `BLOCK_NAMES` and `registry.ts`, metadata in `BLOCK_META` (categories, icons, keywords).
- Every outbound link carries `rel="noopener noreferrer"` when it opens a new tab.
- `apps/web` consumes `@links/blocks` from `dist`: `pnpm build` before any web test or browser check.
- `lint`/`fmt` are read-only; write with `lint:fix`/`fmt:write`. Conventional commits, one commit per task.
- No version numbers in documentation.

## Review Focus

- A user pastes a share URL that is not the canonical one (`youtu.be`, `watch?v=&t=`, `shorts/`, a playlist id where a track id belongs). A reasonable person expects a player, not a blank frame; T3 and T4 pin every accepted shape and the null case.
- An icon chosen from the palette but absent from the UnoCSS safelist renders as an empty box with no error; T5 pins the icon list and asserts the built CSS contains each one.
- The page and the block disagree about "now" — server render versus a visitor in another timezone. T7 pins the countdown parts against an injected clock, and T9 filters visibility server-side so nothing flashes.
- A block whose `visibility.from`/`to` lands exactly on the boundary second is either shown or hidden, never both; T9 pins the inclusive-exclusive choice.
- A stored block from before this plan has no `visibility` and no new properties; it must keep rendering. T9 and every bump carry a migration fixture in `packages/blocks/test/`.

---

### Task 1: `Button` becomes a link card

**Files:**

- Modify: `packages/blocks/src/blocks/button.ts`
- Modify: `apps/web/src/shared/blocks/components/button-block.vue`
- Test: `packages/blocks/test/fixtures/button-v2.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Consumes: `Button` v2 from the foundation plan.
- Produces: `Button` v3 with `thumbnail` (image, optional), `subtitle` (text, optional), `icon` (select, `BLOCK_ICONS` subset, optional), `variant` (select solid | outline | ghost, default solid), `height` (number, 40–96, default 56), `radius` (number, 0–32, default 8).

- [ ] **Step 1: Write the failing migration fixture**

Add `button-v2.ts` reproducing a stored v2 block (text, link, colours, `font-size`, `new-tab`), add it to the history table in `contract.test.ts` asserting it reaches `BLOCK_VERSION`. Run `pnpm --filter @links/blocks test` — expected FAIL.

- [ ] **Step 2: Extend the schema**

Add the six properties, bump `BLOCK_VERSION` to 3, and add a migration step filling defaults (`variant: "solid"`, `height: 56`, `radius: 8`, `thumbnail: null`, `subtitle: null`, `icon: null`) while leaving stored values alone.

- [ ] **Step 3: Run the fixture to verify it passes**

Run: `pnpm --filter @links/blocks test`
Expected: PASS, `Button` migrates v2 → v3, idempotent second pass.

- [ ] **Step 4: Render the card**

`button-block.vue`: a flex row where the thumbnail (rendered through `StorageApi.resolveImageUrl`) sits first, the text column holds `text` and an optional `subtitle` line, and the optional icon sits last. `variant` maps to three style blocks: `solid` fills with the background colour, `outline` keeps a transparent background and uses the border colour, `ghost` drops both. Height and radius come from the new properties through CSS variables; the text keeps `text-overflow: ellipsis`.

- [ ] **Step 5: Verify in the browser**

Build, open the constructor, and check: a plain link looks identical to before the change; a link with a thumbnail, subtitle and icon renders in one row without the text overflowing; all three variants are visibly distinct on the default theme and on a dark page.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks/components/button-block.vue
git commit -m "feat(blocks): turn the button block into a link card"
```

### Task 2: `Heading`, `Divider` and `Spacer`

**Files:**

- Create: `packages/blocks/src/blocks/heading.ts`, `divider.ts`, `spacer.ts`
- Create: `apps/web/src/shared/blocks/components/heading-block.vue`, `divider-block.vue`, `spacer-block.vue`
- Modify: `packages/blocks/src/types.ts` (`BLOCK_NAMES`, `BLOCK_META`), `packages/blocks/src/registry.ts`
- Test: `packages/blocks/test/contract.test.ts` (contract auto-covers new registry entries)

**Interfaces:**

- Consumes: palette metadata and the harness from the foundation plan.
- Produces: three blocks — `Heading` (`text` multiline required, `level` select h1 | h2 | h3 default h2, `align` select left | center | right default center), `Divider` (`style` select line | dashed | dotted | space default line, `color` color, `spacing` number 0–64 default 16), `Spacer` (`height` number 0–200 default 24). All three start at `BLOCK_VERSION` 0.

- [ ] **Step 1: Register the three names**

Add `Heading`, `Divider`, `Spacer` to `BLOCK_NAMES`, `BLOCK_META` (categories Content, Layout, Layout; icons `i-lucide:heading`, `i-lucide:minus`, `i-lucide:move-vertical`; keywords for search) and `registry.ts`. Run `pnpm --filter @links/blocks test` — expected FAIL for the missing modules.

- [ ] **Step 2: Write the three schema modules**

Each exports the same shape as the existing blocks: `BLOCK_VERSION`, `createBlock`, `migrateBlock` (a no-op at version 0), and the default export satisfying `BlockModuleSchema`.

- [ ] **Step 3: Run the contract suite**

Run: `pnpm --filter @links/blocks build && pnpm --filter @links/blocks test`
Expected: PASS — unique property ids, defaults present, idempotent migration for all three.

- [ ] **Step 4: Write the three components**

`heading-block.vue` renders `<component :is="'h' + level">` with the text and alignment; a null or empty text renders nothing. `divider-block.vue` renders an `<hr>` for line styles and an empty div with `height: {spacing}` for `space`, colour from the property with the theme token as fallback. `spacer-block.vue` renders an empty div with `height: {height}px`.

- [ ] **Step 5: Verify in the browser**

Add one of each to a page: heading is a real `h2` in the DOM, divider styles differ visibly, spacer creates the gap and drag-and-drop still reorders all three.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks
git commit -m "feat(blocks): add heading, divider and spacer blocks"
```

### Task 3: `Video` block

**Files:**

- Create: `apps/web/src/shared/blocks/embed-urls.ts`
- Create: `packages/blocks/src/blocks/video.ts`
- Create: `apps/web/src/shared/blocks/components/video-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `apps/web/src/shared/blocks/embed-urls.test.ts`

**Interfaces:**

- Produces, in `embed-urls.ts`: `export type VideoProvider = "youtube" | "vimeo" | "tiktok";` and `export function videoEmbedUrl(provider: VideoProvider, url: string): string | null`.
- Produces: `Video` block — `provider` (select, default youtube), `url` (url, required), `aspect` (select 16:9 | 9:16 | 1:1, default 16:9), `autoplay`, `muted`, `loop` (booleans, default false), `radius` (number 0–32, default 8).

- [ ] **Step 1: Write the failing tests**

Create `apps/web/src/shared/blocks/embed-urls.test.ts`:

```ts
it.each([
  ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
  ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
  ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
])("maps a youtube share link %s", (input, expected) => {
  expect(videoEmbedUrl("youtube", input)).toBe(expected);
});

it("maps vimeo and tiktok share links", () => {
  expect(videoEmbedUrl("vimeo", "https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
  expect(videoEmbedUrl("tiktok", "https://www.tiktok.com/@user/video/7312345678901234567")).toBe(
    "https://www.tiktok.com/player/v1/7312345678901234567",
  );
});

it.each([
  ["youtube", "https://example.com/watch?v=1"],
  ["youtube", "not a url"],
  ["vimeo", "https://vimeo.com/channels/staffpicks"],
  ["tiktok", "https://www.tiktok.com/@user"],
])("returns null for %s with %s", (provider, input) => {
  expect(videoEmbedUrl(provider as VideoProvider, input)).toBeNull();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @links/web test -- embed-urls`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `videoEmbedUrl`**

Parse with `new URL(raw)` in a `try`; return `null` on a throw. YouTube: host in `youtube.com`/`www.youtube.com`/`m.youtube.com` → `searchParams.get("v")`, host `youtu.be` → path segment, path starting `/shorts/` → third segment. Vimeo: numeric path segment only. TikTok: `/video/<id>` segment only.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @links/web test -- embed-urls`
Expected: PASS, all cases.

- [ ] **Step 5: Add the block schema and component**

Schema as in **Interfaces**. Component: when `videoEmbedUrl` returns `null`, render a bordered placeholder with the stored URL as text and no iframe. Otherwise render an iframe with `:src`, `:title="bp.title ?? 'Video'"`, `loading="lazy"`, `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`, and `allowfullscreen`; aspect from the property through CSS `aspect-ratio`; query flags appended for autoplay (forced together with `mute=1`), mute and loop in the provider's own parameter names.

- [ ] **Step 6: Verify in the browser**

Check one link per provider, a vertical TikTok, and a junk URL; confirm the Network tab shows no third-party script and the page has no horizontal scroll.

- [ ] **Step 7: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks
git commit -m "feat(blocks): add a video block with pure iframe embeds"
```

### Task 4: `Music` block

**Files:**

- Create: `packages/blocks/src/blocks/music.ts`
- Create: `apps/web/src/shared/blocks/components/music-block.vue`
- Modify: `apps/web/src/shared/blocks/embed-urls.ts`, `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `apps/web/src/shared/blocks/embed-urls.test.ts`

**Interfaces:**

- Consumes: `embed-urls.ts` from Task 3.
- Produces: `export type MusicProvider = "spotify" | "soundcloud" | "apple-music" | "youtube-music";` and `export function musicEmbedUrl(provider: MusicProvider, url: string): string | null`.
- Produces: `Music` block — `provider` (select, default spotify), `url` (url, required), `height` (select compact | full, default compact).

- [ ] **Step 1: Write the failing tests**

```ts
it("maps spotify kinds to the embed path", () => {
  expect(musicEmbedUrl("spotify", "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")).toBe(
    "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT",
  );
  expect(musicEmbedUrl("spotify", "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc")).toBe(
    "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
  );
});

it("maps soundcloud and apple music", () => {
  expect(musicEmbedUrl("soundcloud", "https://soundcloud.com/artist/track")).toBe(
    "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://soundcloud.com/artist/track"),
  );
  expect(musicEmbedUrl("apple-music", "https://music.apple.com/us/album/x/1234567890")).toBe(
    "https://embed.music.apple.com/us/album/x/1234567890",
  );
});

it("maps a youtube music link through the video mapper", () => {
  expect(musicEmbedUrl("youtube-music", "https://music.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
  );
});

it("returns null for a spotify artist page and for junk", () => {
  expect(musicEmbedUrl("spotify", "https://open.spotify.com/artist/abc")).toBeNull();
  expect(musicEmbedUrl("soundcloud", "https://example.com/x")).toBeNull();
});
```

- [ ] **Step 2: Run to verify it fails**, then implement and re-run to green

Run: `pnpm --filter @links/web test -- embed-urls`
Expected: FAIL, then PASS. Spotify accepts `track`, `album`, `playlist`, `episode`, `show` path kinds only. Apple Music replaces host `music.apple.com` with `embed.music.apple.com` and keeps path and region. SoundCloud accepts host `soundcloud.com`/`on.soundcloud.com` and wraps the URL through `encodeURIComponent`.

- [ ] **Step 3: Add the block schema and component**

Component mirrors the video one: null → placeholder card with the link; otherwise an iframe with `loading="lazy"` and a fixed height (`compact` 152px, `full` 352px).

- [ ] **Step 4: Verify in the browser**

One Spotify track, one playlist, one SoundCloud track, one Apple Music album, one junk URL. Confirm players load, the placeholder appears for junk, and no horizontal scroll appears.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks
git commit -m "feat(blocks): add a music block for streaming embeds"
```

### Task 5: `SocialIcons` block

**Files:**

- Create: `packages/blocks/src/blocks/social-icons.ts`
- Create: `apps/web/src/shared/blocks/components/social-icons-block.vue`
- Create: `apps/web/src/shared/blocks/social-icons.ts`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Modify: `apps/web/uno.config.ts` (add the `simple-icons` collection and a safelist entry)
- Test: `apps/web/src/shared/blocks/social-icons.test.ts`

**Interfaces:**

- Produces, in `apps/web/src/shared/blocks/social-icons.ts`: `export const SOCIAL_SLOTS: readonly { key: string; label: string; icon: string; hrefPrefix: string }[]` — eight entries: `telegram` (`i-simple-icons:telegram`), `instagram`, `youtube`, `tiktok`, `x`, `vk`, `whatsapp`, `email` (`i-lucide:mail`, `hrefPrefix: "mailto:"`); and `export function socialHref(slot: { hrefPrefix: string }, value: string | null | undefined): string | null`.
- Produces: `SocialIcons` block — one `url` property per slot key (`telegram`, `instagram`, …, `email`), plus `variant` (select filled | outline | plain, default filled), `size` (number 16–48, default 24), `align` (select left | center | right, default center).

- [ ] **Step 1: Write the failing test**

```ts
it("builds a mailto href for the email slot and an https href for the rest", () => {
  expect(
    socialHref(
      SOCIAL_SLOTS.find((s) => s.key === "email")!,
      "me@example.com",
    ),
  ).toBe("mailto:me@example.com");
  expect(
    socialHref(
      SOCIAL_SLOTS.find((s) => s.key === "telegram")!,
      "https://t.me/me",
    ),
  ).toBe("https://t.me/me");
});

it("returns null for empty and whitespace values", () => {
  const slot = SOCIAL_SLOTS[0]!;
  expect(socialHref(slot, "")).toBeNull();
  expect(socialHref(slot, "   ")).toBeNull();
  expect(socialHref(slot, null)).toBeNull();
});
```

- [ ] **Step 2: Run to verify it fails**, implement `SOCIAL_SLOTS` and `socialHref`, re-run to green

Run: `pnpm --filter @links/web test -- social-icons`
Expected: FAIL, then PASS. `socialHref` trims, returns `null` for empty, and prefixes only when the value lacks `scheme:`.

- [ ] **Step 3: Add the icon collection and safelist**

Add `@iconify-json/simple-icons` to `apps/web/package.json` devDependencies (and `packages/ui` if the preset resolves collections there), register the collection in `uno.config.ts` next to `lucide`, and safelist every `SOCIAL_SLOTS[].icon` value plus the palette icons. Run `pnpm install`.

- [ ] **Step 4: Add the block schema and component**

Component maps `SOCIAL_SLOTS` to anchors, skipping slots whose `socialHref` is `null`; renders nothing at all when every slot is empty. Anchors get `target="_blank"` and `rel="noopener noreferrer"`, except the `mailto:` one, which gets neither.

- [ ] **Step 5: Verify the icons exist in the built CSS**

Run: `pnpm build && grep -l 'simple-icons' apps/web/.output/public/_nuxt/*.css | head -1`
Expected: a file name. Repeat the check for one more slot icon; no output means the safelist is wrong.

- [ ] **Step 6: Verify in the browser**

Fill three slots, leave five empty: only three icons render, order is stable, clicking opens the right URL in a new tab, `mailto:` opens the mail client.

- [ ] **Step 7: Commit**

```bash
git add packages/blocks apps/web/src apps/web/uno.config.ts apps/web/package.json
git commit -m "feat(blocks): add a social icons block"
```

### Task 6: `Map` block

**Files:**

- Create: `apps/web/src/shared/blocks/map-url.ts`
- Create: `packages/blocks/src/blocks/map.ts`
- Create: `apps/web/src/shared/blocks/components/map-block.vue`
- Modify: `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `apps/web/src/shared/blocks/map-url.test.ts`

**Interfaces:**

- Produces, in `map-url.ts`: `export function mapEmbedUrl(address: string, zoom: number): string | null` and `export function mapLinkUrl(address: string): string`.
- Produces: `Map` block — `address` (text multiline, required), `zoom` (number 1–20, default 15), `height` (number 120–400, default 240), `caption` (text, optional), `show-link` (boolean, default true).

- [ ] **Step 1: Write the failing test**

```ts
it("encodes the address into the keyless maps embed", () => {
  expect(mapEmbedUrl("Tverskaya 1, Moscow", 12)).toBe(
    "https://maps.google.com/maps?q=Tverskaya%201%2C%20Moscow&z=12&output=embed",
  );
});

it("returns null for an empty or whitespace address", () => {
  expect(mapEmbedUrl("   ", 12)).toBeNull();
  expect(mapEmbedUrl("", 12)).toBeNull();
});

it("clamps the zoom into the provider range", () => {
  expect(mapEmbedUrl("Moscow", 99)).toContain("z=20");
});
```

- [ ] **Step 2: Run to verify it fails**, implement, re-run to green

Run: `pnpm --filter @links/web test -- map-url`
Expected: FAIL, then PASS.

- [ ] **Step 3: Add the block schema and component**

Component renders nothing for a null embed URL; otherwise the iframe (`loading="lazy"`, `:title="bp.caption ?? 'Map'"`), an optional caption line, and the "Open in maps" link when `show-link` is on.

- [ ] **Step 4: Verify in the browser**

Check a Latin address and a Cyrillic one — both must land on the right point; confirm lazy loading and no horizontal scroll on a narrow viewport.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks apps/web/src/shared/blocks
git commit -m "feat(blocks): add a map block"
```

### Task 7: `date` property type and the `Countdown` block

**Files:**

- Modify: `packages/blocks/src/types.ts`
- Create: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/fields/date-field.vue`
- Modify: `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/block-properties-editor.vue`
- Create: `apps/web/src/shared/blocks/countdown.ts`
- Create: `packages/blocks/src/blocks/countdown.ts`
- Create: `apps/web/src/shared/blocks/components/countdown-block.vue`
- Modify: `packages/blocks/src/registry.ts`
- Test: `apps/web/src/shared/blocks/countdown.test.ts`

**Interfaces:**

- Produces, in `packages/blocks/src/types.ts`: `export interface IBlockPropertyDate<T = string> extends IBlockPropertyCommon<T> { type: "date"; withTime?: boolean; }` added to the `BlockProperty` union and to `BlockPropertyType`.
- Produces, in `countdown.ts`: `export interface CountdownParts { days: number; hours: number; minutes: number; seconds: number; finished: boolean }` and `export function countdownParts(targetIso: string, now: Date): CountdownParts` (`finished: true` once `now >= target`, all parts 0) plus `export function formatCountdown(parts: CountdownParts): string`.
- Produces: `Countdown` block — `target` (date withTime), `title` (text, optional), `finished-text` (text, default "The countdown has finished"), `variant` (select box | plain, default box), `hide-after-finish` (boolean, default false).

- [ ] **Step 1: Write the failing test**

```ts
it("splits the remaining time into parts", () => {
  const parts = countdownParts("2026-12-01T00:00:00.000Z", new Date("2026-11-30T23:59:00.000Z"));

  expect(parts).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0, finished: false });
});

it("is finished at and after the target instant", () => {
  expect(countdownParts("2026-12-01T00:00:00.000Z", new Date("2026-12-01T00:00:00.000Z")).finished).toBe(true);
  expect(countdownParts("2026-12-01T00:00:00.000Z", new Date("2026-12-02T00:00:00.000Z"))).toEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: true,
  });
});

it("is finished when the target is not a date", () => {
  expect(countdownParts("nonsense", new Date()).finished).toBe(true);
});
```

- [ ] **Step 2: Run to verify it fails**, implement `countdown.ts`, re-run to green

Run: `pnpm --filter @links/web test -- countdown`
Expected: FAIL, then PASS. Compute the difference in absolute milliseconds from the parsed target, not from local date parts.

- [ ] **Step 3: Add the `date` property type and its field**

Add the interface to `types.ts`; create `date-field.vue` using `UIInput` with `type="datetime-local"` when `field.withTime` and `type="date"` otherwise, converting to and from an ISO string; register it in `fieldsMap`. Adding the type without the field must fail to compile — verify by running `pnpm --filter @links/web build` before adding the field.

- [ ] **Step 4: Add the block schema and component**

Component renders the title, then either the four parts or `finished-text`; holds a `now` ref updated by `setInterval` in `onMounted` and cleared in `onBeforeUnmount`, initialised to a stable value on the server so hydration matches. `hide-after-finish` renders nothing once finished.

- [ ] **Step 5: Verify hydration and behaviour**

Build and open a page with a target a minute ahead: no hydration warning in the console, the seconds tick, and at the target instant `finished-text` appears (or the block disappears with `hide-after-finish`).

- [ ] **Step 6: Commit**

```bash
git add packages/blocks apps/web/src
git commit -m "feat(blocks): add a date property type and a countdown block"
```

### Task 8: `QrCode` block

**Files:**

- Create: `apps/web/src/shared/blocks/qr.ts`
- Create: `packages/blocks/src/blocks/qr-code.ts`
- Create: `apps/web/src/shared/blocks/components/qr-code-block.vue`
- Modify: `apps/web/package.json` (add `uqr`), `packages/blocks/src/types.ts`, `packages/blocks/src/registry.ts`
- Test: `apps/web/src/shared/blocks/qr.test.ts`

**Interfaces:**

- Produces, in `qr.ts`: `export function qrSvg(value: string, options: { size: number; foreground?: string; background?: string }): string` — SVG markup produced by `uqr`'s `renderSVG`, with the foreground and background applied.
- Produces: `QrCode` block — `url` (url, optional — empty means the page's own address, resolved by the component from `useRequestURL()`), `caption` (text, optional), `size` (number 80–320, default 160), `foreground`/`background` (colour, defaults `#171515` / `#ffffff`).

- [ ] **Step 1: Write the failing test**

```ts
it("renders svg markup sized from the options", () => {
  const svg = qrSvg("https://links.example/me", { size: 160 });

  expect(svg).toContain("<svg");
  expect(svg).toMatch(/width=["']?160/);
});

it("applies the requested colours", () => {
  const svg = qrSvg("https://links.example/me", { size: 120, foreground: "#112233", background: "#ffffee" });

  expect(svg).toContain("#112233");
  expect(svg).toContain("#ffffee");
});

it("produces different output for different values", () => {
  expect(qrSvg("https://a.example", { size: 100 })).not.toBe(qrSvg("https://b.example", { size: 100 }));
});
```

- [ ] **Step 2: Run to verify it fails**, add `uqr`, implement `qrSvg`, re-run to green

Run: `pnpm install && pnpm --filter @links/web test -- qr`
Expected: FAIL, then PASS.

- [ ] **Step 3: Add the block schema and component**

Schema as in **Interfaces**. Component resolves the value (`url` or `useRequestURL().href`), renders the SVG with `v-html` from the sanitised library output, and prints the caption below. `v-html` here is acceptable only because the markup is generated locally from a library, never from user HTML — say so in a comment.

- [ ] **Step 4: Verify in the browser**

Scan the rendered code with a phone: it must open the intended target. Check the Network tab shows no third-party request, and the SVG stays sharp when zoomed.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks apps/web/src apps/web/package.json
git commit -m "feat(blocks): add a locally rendered QR code block"
```

### Task 9: Per-block visibility and schedule

**Files:**

- Modify: `packages/blocks/src/types.ts` (`IBlock`)
- Create: `apps/web/src/shared/blocks/visibility.ts`
- Modify: `apps/web/src/features/links/ui/link-page-renderer/link-page-renderer.vue`, `apps/web/src/widgets/multilinks-constructor/ui/workspace/workspace.vue`, `apps/web/src/widgets/multilinks-constructor/ui/block-properties-editor/block-properties-editor.vue`, `apps/web/src/widgets/multilinks-constructor/ui/workspace/page-block.vue`
- Test: `apps/web/src/shared/blocks/visibility.test.ts`, `packages/blocks/test/contract.test.ts`

**Interfaces:**

- Produces, in `packages/blocks/src/types.ts`: `export interface IBlockVisibility { hidden?: boolean; from?: string; to?: string }` and `IBlock.visibility?: IBlockVisibility`.
- Produces, in `visibility.ts`: `export function isBlockVisible(visibility: IBlockVisibility | undefined, now: Date): boolean` — no visibility or an empty object is visible; `hidden: true` is never visible; `from` is inclusive, `to` is exclusive; an unparsable bound is ignored.

- [ ] **Step 1: Write the failing test**

```ts
const now = new Date("2026-12-01T12:00:00.000Z");

it("keeps a block without visibility visible", () => {
  expect(isBlockVisible(undefined, now)).toBe(true);
  expect(isBlockVisible({}, now)).toBe(true);
});

it("honours hidden", () => {
  expect(isBlockVisible({ hidden: true }, now)).toBe(false);
});

it("treats from as inclusive and to as exclusive", () => {
  expect(isBlockVisible({ from: "2026-12-01T12:00:00.000Z" }, now)).toBe(true);
  expect(isBlockVisible({ from: "2026-12-01T12:00:01.000Z" }, now)).toBe(false);
  expect(isBlockVisible({ to: "2026-12-01T12:00:00.000Z" }, now)).toBe(false);
  expect(isBlockVisible({ to: "2026-12-01T12:00:01.000Z" }, now)).toBe(true);
});

it("ignores an unparsable bound", () => {
  expect(isBlockVisible({ from: "yesterday", to: "tomorrow" }, now)).toBe(true);
});
```

- [ ] **Step 2: Run to verify it fails**, implement, re-run to green

Run: `pnpm build && pnpm --filter @links/web test -- visibility`
Expected: FAIL, then PASS.

- [ ] **Step 3: Filter on the public renderer**

`link-page-renderer.vue` computes `visibleBlocks = blocks.filter(b => isBlockVisible(b.visibility, new Date()))` on the server render, so a hidden block is absent from the HTML rather than hidden by CSS.

- [ ] **Step 4: Surface it in the constructor**

`page-block.vue` accepts `isHidden` and renders the block at 40% opacity with an `i-lucide:eye-off` badge; `block-properties-editor.vue` gains a "Visibility" `OptionsSection` at the top with a switch for `hidden` and two `date` inputs (`from`, `to`) writing to `block.visibility`; saving keeps working through the existing store actions.

- [ ] **Step 5: Run the suites**

Run: `pnpm --filter @links/blocks test && pnpm --filter @links/web test`
Expected: PASS — including the contract suite, which must still migrate every fixture with `visibility` untouched.

- [ ] **Step 6: Verify in the browser**

Hide a block: it stays visible-but-dimmed in the constructor and is gone from the published HTML (`curl` the public URL and grep for its text). Confirm undo/redo survives toggling and the block's content is intact after re-showing.

- [ ] **Step 7: Commit**

```bash
git add packages/blocks apps/web/src
git commit -m "feat(blocks): add per-block visibility and scheduling"
```
