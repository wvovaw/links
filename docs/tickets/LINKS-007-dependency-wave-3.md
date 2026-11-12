---
type: ticket
id: LINKS-007
title: "Dependencies wave 3: frontend majors"
status: done
priority: high
area: web
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-005
blocks:
  - LINKS-008
---

# LINKS-007 — Dependencies wave 3: frontend majors

## What to build

Wave 3 of the dependency campaign: the frontend majors, including the one real migration of the
campaign — leaving the abandoned primitives library.

In scope:

- **test stack**: `vitest` next major, `@vitest/ui`, `happy-dom`, `@pinia/testing`, `@vue/test-utils`
  (current one is deferred behind a class-component breaking change)
- **composables**: `@vueuse/core` and `@vueuse/nuxt` to the current major, checking which composables
  the UI library and the web app actually use
- **drag and drop**: `@formkit/drag-and-drop` to the current line. The constructor's reordering is
  wired through `setValues` in `page-renderer.vue`; that integration is expected to need a rewrite.
  Reordering must keep working with undo history intact.
- **library build**: `unbuild` and `mkdist` majors. `packages/ui/build.config.ts` needs rework, and
  the published contract must survive: `exports` (`dist/index.*`, `./preset`, `./theme.css`),
  `components.d.ts`.
- **primitives migration**: `radix-vue` → `reka-ui` (current major) in `packages/ui` and `apps/web`,
  including the Nuxt module (`radix-vue/nuxt` → `reka-ui/nuxt`), every import, the CSS variable
  prefix (`--radix-*` → `--reka-*`) in theme CSS, and the UI library's `peerDependencies`.
  `radix-vue` has been frozen upstream for a long time; this is the reason the wave exists.
- **leftovers from wave 1**: `valibot`, `vaul-vue` — the only remaining direct patch/minor gaps.

Out of scope: waves 2, 4, 5 packages (backend majors, tooling majors, framework majors). No redesign of
components: the migration keeps current behaviour and appearance.

## Acceptance criteria

- [x] `radix-vue` appears in no `package.json`, no import, no CSS variable and no lockfile entry
- [x] the dark/light theming still works after the CSS variable prefix change (visually checked in the
      constructor and on a public page)
- [x] the web test suite passes on the new vitest major and the process exits on its own — the
      "close timed out" hang is part of this wave
- [x] `pnpm --filter @links/ui lib:build` produces the same public contract as before; a consuming
      build (`pnpm build`) resolves `@links/ui`, `@links/ui/preset` and `@links/ui/theme.css`
- [x] drag-and-drop reordering in the constructor works, records history, and survives undo/redo
- [x] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [x] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the migration guide
      that was read, what changed here, what was deferred
- [x] documentation contains no version numbers outside `docs/upgrades/`

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- The radix → reka migration has an official guide; read it before touching imports, and expect
  data-attribute names to change too, not just CSS variables.
- Known type-check debt is in scope only where this wave causes it: `vue-tsc` already fails on
  `apps/web` and `packages/ui`, and the UI library build already emits `TS2742` for its toast
  composable. Fixing that debt is welcome if it is cheap once `@vueuse/*` and vue-tsc are current;
  otherwise record it and move on. Type checking is not a gate.
- A `mkdist` ↔ `vue-tsc` peer warning appeared after the wave 1 alignment; this wave owns it.

## Verification

All commands ran on the runtime pinned by `.nvmrc`, through `fnm exec --using=26.13.1 --`.

- `pnpm install` — clean resolution; no `radix-vue` in the result. Remaining peer warnings are the
  out-of-scope ones listed in the journal plus the new `vitest → @types/node` warning owned by wave 4.
- `git grep radix-vue -- . ':!docs/tickets' ':!docs/upgrades'` — no output. `grep radix
  pnpm-lock.yaml` only matches the unrelated `radix3` package. `git grep -i radix` likewise only
  matches `radix3`.
- Built output: `packages/ui/dist/css/theme.css` and the web production CSS contain only `--reka-*`
  variables (`--reka-accordion-content-height`, `--reka-collapsible-content-height`,
  `--reka-select-trigger-*`, `--reka-toast-swipe-*`); no `--radix-*`.
- `pnpm --filter @links/ui lib:build` — exits 0 with no warnings; `dist/index.*`, `dist/preset/*`,
  `dist/css/theme.css` and the per-component `.d.ts` files are produced. The toast TS2742 is gone.
- `pnpm build` — all packages build. From `apps/web`, `import.meta.resolve` resolves `@links/ui`,
  `@links/ui/preset` and `@links/ui/theme.css` into `packages/ui/dist`. Note: `components.d.ts` is
  listed in `packages/ui/package.json#files` but was already absent before this wave and is still not
  produced by the build; the journal records this as a stale packaging entry rather than a regression.
- `pnpm --filter @links/web test` — 4 files, 62 tests pass; the process exits with code 0 and no
  "close timed out" message. The new `constructor.store.test.ts` covers the reorder-history rules.
- Browser check (Chromium, constructor and public page): the public page and constructor both loaded;
  the constructor showed all three seeded blocks. Toggling `data-theme` between `light` and `dark`
  changed the computed body text colour from `rgb(0, 0, 0)` to `rgb(255, 255, 255)`; screenshots were
  inspected. The public page footer and blocks followed the same theme.
- Drag check (Chromium via the DevTools protocol): pressed and dragged the first block
  (`block-par1`) past the second; the rendered order became `block-btn1, block-par1, block-ava1`,
  the undo button became enabled, undo restored the original order and redo re-applied the new one.
- Type checking: `vue-tsc --noEmit` passes in `apps/web`. In `packages/ui` the library sources and
  generated declarations are clean; the remaining errors are the pre-existing docs-app errors that
  require the docs Nuxt build's generated aliases and auto-imports.
- `pnpm verify` — green (tickets:check, lint, fmt, build, test). The working tree contains only the
  wave's intended edits; no build artifacts.
