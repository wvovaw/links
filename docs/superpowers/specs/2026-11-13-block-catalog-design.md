# Block catalog: design

## Why

The product has four blocks — `Avatar`, `Button`, `Paragraph`, `Picture` — and a page that renders
them in one column. Every competitor in this market ships ten to twenty: a link-in-bio page without
social icons, embeds, structure or any way to sell something is not a product, it is a demo.

The gap is not evenly distributed either. Published platform data says the block type matters less
than what the block carries:

| Signal                     | Value              | Source                         |
| -------------------------- | ------------------ | ------------------------------ |
| Thumbnail on a link        | +34% CTR           | Linktree 2024, via aggregators |
| Video embed on the page    | 1.8× dwell time    | Later 2024, via aggregators    |
| Top three links            | ≈80% of all clicks | Shorby 2024, via aggregators   |
| Product cards vs link list | 2.3× conversion    | Beacons 2024, via aggregators  |

Treat those as direction, not precision: they were reported second-hand and the aggregators do not
publish their method. What they agree on is that _what a block shows_ beats _how many buttons exist_.

Frequency across 12 platforms (Linktree, Beacons, Taplink, Bio.link, Milkshake, Hoobe, Komi, Bento,
Snipfeed, Later, Carrd, Content Anchor):

| Block type          | Platforms | Block type         | Platforms |
| ------------------- | --------- | ------------------ | --------- |
| Link / Button       | 12        | Commerce / Store   | 9         |
| Text / Paragraph    | 11        | Email signup       | 8         |
| Image               | 11        | Tips / Donations   | 6         |
| Social icons        | 11        | Events             | 5         |
| Video embed         | 11        | Countdown          | 3         |
| Music / Audio embed | 9         | FAQ, Map, Carousel | 3         |
| Contact form        | 9         | Divider / Spacer   | 4         |

## Goals

1. A page can be structured, illustrated and monetised without leaving the constructor.
2. Adding the next block costs one schema file, one component, metadata — not a refactor.
3. Each block looks like it belongs to the page: one theme, shared tokens, no per-block one-offs.
4. Existing published pages render exactly as they do today, before and after every step.

## Non-goals

- Bento/grid page layout, container or column blocks. The page stays one column; a block may use a
  grid inside itself.
- Own checkout, orders, stock, payouts, fees. Selling means a link to someone else's checkout.
- Rich-text editing. `Paragraph` stays plain text until someone can state its acceptance criteria.
- Custom HTML/JS blocks, and third-party embeds that need a vendor JS SDK (Instagram, X, Telegram,
  Stripe buy-button, Gumroad overlay). The public page must stay renderable under a strict CSP.
- Internal sub-pages under one slug. Attractive (Taplink ships 512) but the data model and routing
  are undecided; it needs its own design.
- AI chat blocks. Products exist, effect data does not, and the page is a static server render.

## Anti-goals

- A block that duplicates an existing one under a new name to avoid touching an old schema. `Button`
  grows into a link card instead of gaining a sibling.
- A property type added "just in case". `date` and `list` each arrive with a block that needs them.
- Fixture-free migrations. Every schema change carries a step in `migrateBlock` and a test.

## Constraints discovered in the codebase

These shaped the decomposition; each one has a task that removes it.

- Property types are `text | number | boolean | select | color | url | image`
  (`packages/blocks/src/types.ts`). No repeatable group, no rich text.
- Icons are generated at build time from scanned sources (`apps/web/uno.config.ts`), so an icon
  chosen at runtime exists in CSS only if it is safelisted. `lucide` carries no brand marks.
- Uploads are image-only by policy, and by accident: `POST /storage/images` has no size limit, no
  mimetype filter, and `extensionFor` falls back to the uploader's file extension.
- `links.background` is a client-authored CSS string, accepted as `@IsString()` and bound as
  `:style`. It is the only way to style a page, and it is an injection surface.
- No block-level visibility, scheduling, or analytics exists anywhere.
- The palette is a flat list of bare names derived from `BLOCK_NAMES`.
- `packages/blocks` has no test runner at all; the existing `migrateBlock` chains are unverified.

## Approaches considered

**One giant block module.** Every block in a single file with a shared factory. Rejected: the
existing registry is a per-block module with its own `BLOCK_VERSION` and `migrateBlock`, and
per-block versioning is what keeps published pages alive.

**Generic "embed" block driven by provider detection.** One block that accepts any URL and decides
what to render. Rejected: the property UI becomes a lie (autoplay field shown for Spotify), and
unknown providers degrade to nothing. Separate `Video` and `Music` blocks keep the schema honest.

**Fixed slots until a list type exists.** Chosen for social icons only — eight URL properties, empty
means hidden — because social icons are the highest-value block that needs rows, and waiting for the
list type would delay them by a whole plan. Everything else with rows waits.

**Typed page theme vs. keep the CSS string.** The string is flexible and already shipped, but it
cannot be validated, cannot be edited by someone who does not write CSS, and lets a client inject
`background:url(...)` into every visitor's page. Chosen: typed model, rendered as CSS custom
properties, with the legacy string still honoured for pages that have one.

## Decisions

1. **Page layout: one column.** `.link__container` keeps its 640px stacked layout.
2. **Monetization: in scope, external checkout only.** Products, price lists and tips are blocks
   pointing at Stripe Payment Links, Gumroad, Ko-fi or BuyMeACoffee.
3. **Embeds: pure iframes from an allowlist.** YouTube, Vimeo, TikTok (embed-player), Spotify,
   SoundCloud, Apple Music, Google Maps, Discord, Calendly, Substack.
4. **Page theme: typed and validated**, replacing client-authored CSS.

## What the plans decide, and what is left to the builder

Four plans consume this design, in order; each produces working software on its own:

| Plan                                  | Delivers                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `2026-11-13-blocks-foundation.md`     | palette metadata, typed page theme, schema tests, repairs to the four existing blocks        |
| `2026-11-13-blocks-catalog-basic.md`  | link card, structure, video, music, social icons, map, date type + countdown, QR, visibility |
| `2026-11-13-blocks-repeating-rows.md` | `list` property type, FAQ, gallery, products, testimonials                                   |
| `2026-11-13-backend-growth.md`        | upload limits and non-image assets, block analytics, forms and submissions                   |

Left to the builder, deliberately: the exact copy of block labels and descriptions, the preset
palette of background gradients, the icon subset offered for links, and every visual detail the
theme tokens do not pin. Nothing in those areas breaks a published page if it is chosen differently.
