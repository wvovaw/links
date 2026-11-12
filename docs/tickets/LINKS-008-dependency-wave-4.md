---
type: ticket
id: LINKS-008
title: "Dependencies wave 4: tooling majors"
status: claimed
priority: medium
area: tooling
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-006
  - LINKS-007
blocks:
  - LINKS-009
---

# LINKS-008 — Dependencies wave 4: tooling majors

## What to build

Wave 4 of the dependency campaign: the repository tooling, plus the type packages that must catch up
with the runtime.

In scope:

- `@commitlint/cli` and `@commitlint/config-conventional` → current major; the `commit-msg` hook must
  keep working (a bad message rejected, a good one accepted) and the config may need reshaping
- `taze` → current major. It jumped several majors; `pnpm upg` must be rewritten around whatever the
  current CLI expects, or replaced with an explicit command
- `@types/node` → the major that matches `.nvmrc`, in every package that declares it. Types have been
  lagging the runtime since the wave 0.5 move
- `@vitejs/plugin-vue` → current major, which is what clears its peer warning against the `vite` that
  Nuxt resolves
- `@vue/tsconfig` → current minor/major used by `packages/ui`
- the `nuxt` ↔ `rolldown` peer warning noted in the journal: resolve it here if a tooling bump does,
  otherwise state why it cannot be resolved from this package set

Out of scope: waves 2, 3 and 5 packages. No source refactors: if a bump demands one, keep it minimal
and say so in the journal.

## Acceptance criteria

- [ ] `pnpm outdated -r` lists nothing in scope, and every remaining entry is either a wave 5 package
      or explained in the journal
- [ ] the commit hook still rejects a non-conventional message and accepts a conventional one
- [ ] `pnpm upg` (or its replacement) runs and reports without crashing
- [ ] `@types/node` matches the runtime named by `.nvmrc` in every package that uses it
- [ ] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [ ] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the release notes
      read, what changed here, what was deferred
- [ ] documentation contains no version numbers outside `docs/upgrades/`

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- This wave touches root and multi-package devDependencies, so it is deliberately scheduled after the
  waves that touch those same manifests. Do not start it while they are unmerged.
- Raising `@types/node` to the runtime major can surface type errors in `apps/backend` and
  `packages/ui`; those are in scope to fix, unlike the pre-existing `vue-tsc` debt.
