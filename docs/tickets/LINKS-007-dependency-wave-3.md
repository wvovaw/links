---
type: ticket
id: LINKS-007
title: "Dependencies wave 3: frontend majors"
status: claimed
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

- [ ] `radix-vue` appears in no `package.json`, no import, no CSS variable and no lockfile entry
- [ ] the dark/light theming still works after the CSS variable prefix change (visually checked in the
      constructor and on a public page)
- [ ] the web test suite passes on the new vitest major and the process exits on its own — the
      "close timed out" hang is part of this wave
- [ ] `pnpm --filter @links/ui lib:build` produces the same public contract as before; a consuming
      build (`pnpm build`) resolves `@links/ui`, `@links/ui/preset` and `@links/ui/theme.css`
- [ ] drag-and-drop reordering in the constructor works, records history, and survives undo/redo
- [ ] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [ ] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the migration guide
      that was read, what changed here, what was deferred
- [ ] documentation contains no version numbers outside `docs/upgrades/`

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- The radix → reka migration has an official guide; read it before touching imports, and expect
  data-attribute names to change too, not just CSS variables.
- Known type-check debt is in scope only where this wave causes it: `vue-tsc` already fails on
  `apps/web` and `packages/ui`, and the UI library build already emits `TS2742` for its toast
  composable. Fixing that debt is welcome if it is cheap once `@vueuse/*` and vue-tsc are current;
  otherwise record it and move on. Type checking is not a gate.
- A `mkdist` ↔ `vue-tsc` peer warning appeared after the wave 1 alignment; this wave owns it.
