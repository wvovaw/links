---
type: ticket
id: LINKS-005
title: "Dependencies wave 1: patches, minors and version alignment"
status: done
priority: high
area: tooling
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-004
blocks:
  - LINKS-006
  - LINKS-007
---

# LINKS-005 — Dependencies wave 1: patches, minors and version alignment

## What to build

Wave 1 of the dependency campaign: take every package that only needs a patch or minor bump to its
current release, and remove the version drift inside the workspace. No behaviour rewrite is expected;
this wave exists to shrink the diff of the later majors.

In scope:

- framework minors: `nuxt`, `@nuxt/content`, `@nuxt/image`, `@nuxt/test-utils`, `@nuxt/schema`
- frontend minors: `vue`, `vue-router`, `pinia`, `@pinia/nuxt`, `unocss` (all four packages),
  `@iconify-json/*`
- build/dev minors: `tsdown`, `oxlint`, `oxfmt`, `better-sqlite3` (native: rebuild and prove it loads)
- **alignment**, equally part of the job:
  - `vue-tsc` and `@vue/typescript-plugin` on one current major everywhere (`packages/ui` still sits
    on an older major than `apps/web`)
  - `@nuxt/schema` must not stay pinned to a version that disagrees with `nuxt`
  - one TypeScript version across the workspace instead of three
- clear the peer warnings recorded in the campaign baseline, where a patch/minor fixes them

Out of scope — these are later waves and must not be touched here: `vitest`/`@vitest/ui` majors,
`happy-dom`, `@pinia/testing`, `@vueuse/*`, `@formkit/drag-and-drop`, `unbuild`/`mkdist`,
`radix-vue` → `reka-ui`, `multer`, `argon2`, `class-validator`, `@commitlint/*`, `taze`,
`@types/node`, `@vitejs/plugin-vue`, `@vue/tsconfig`, TypeScript's next major, NestJS, TypeORM.

## Acceptance criteria

- [x] every in-scope package is on its current release; `pnpm outdated -r` no longer lists them
- [x] a single TypeScript version resolves in the workspace, and `packages/ui` uses the same
      `vue-tsc` major as `apps/web`
- [x] `@nuxt/schema` agrees with the installed `nuxt`
- [x] the peer warnings from the campaign baseline are gone, or each remaining one is explained in
      the campaign journal with the wave that will fix it
- [x] native modules still load after their bump (`better-sqlite3` opens a database and runs a query)
- [x] `pnpm verify` green twice in a row, and the working tree still clean after the second run
- [x] formatting churn (if the formatter bump causes it) is its own commit, separate from the bumps
- [x] `docs/upgrades/2026-11-dependency-majors.md` records, per package: from → to, the release notes
      or migration guide that was read, what changed here, and what was deferred
- [x] documentation contains no version numbers outside `docs/upgrades/`

## Verification

All commands ran through the version manager on the runtime pinned in `.nvmrc`.

- `pnpm install` after deleting every `node_modules` directory: install completed; the remaining
  unmet-peer output is the list recorded in the campaign journal, each entry assigned to a wave.
- `pnpm outdated -r`: no in-scope package is listed. The entries that remain are the out-of-scope
  set named above plus the three deliberately deferred packages the journal lists under "Left
  behind deliberately".
- Alignment, read from the installed trees: all four workspace packages resolve the same TypeScript
  version; `vue-tsc` reports the same major in `apps/web` and `packages/ui`, as does
  `@vue/typescript-plugin`; `@nuxt/schema` is pinned to the version `nuxt` resolves.
- `pnpm build`: green for every package, libraries included. The pre-existing TS2742 on the toast
  composable is still emitted and still does not fail the build.
- `pnpm verify`: green twice in a row; `git status` was empty after the second run. The web suite
  reported 61 passing tests, and the vitest process still does not exit on its own (known debt,
  wave 3).
- Native proof: `better-sqlite3` was required under the pinned runtime, opened an in-memory
  database, created a table, inserted and selected a row. Then `apps/backend/data.sqlite` was
  deleted and the compiled backend was started: the baseline migration applied on boot and the
  resulting schema contained the users, links, refresh sessions, block images and migrations tables.
- `vue-tsc --noEmit` in `apps/web` and `packages/ui`: still fails with the same classes of
  pre-existing errors as the campaign baseline (Pinia/UI declaration typings, the UI docs site, the
  `useToast` declaration). Not a gate, unchanged by this wave.
- `pnpm tickets:check`: passed with zero warnings.
- Commits: claim, version bumps, formatter churn, then this documentation update. The reformat is a
  separate commit from the bumps, as required.

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default, so prefix commands or shell
  out through the version manager.
- `lint`/`fmt` are read-only; use `lint:fix`/`fmt:write` when you intend to change files.
- Library changes are invisible to `apps/web` until `pnpm build` runs, and the web test suite needs
  the built libraries too — the gate already orders build before test, keep it that way.
- The formatter is pre-1.0 and its bump is allowed to reformat the tree; land that as its own
  commit.
- Tsdown is pre-1.0 as well: if its bump fights the current TypeScript version, prefer the
  workspace-wide TypeScript version and record why in the journal.
