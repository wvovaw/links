---
type: ticket
id: LINKS-008
title: "Dependencies wave 4: tooling majors"
status: done
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

- [x] `pnpm outdated -r` lists nothing in scope, and every remaining entry is either a wave 5 package
      or explained in the journal
- [x] the commit hook still rejects a non-conventional message and accepts a conventional one
- [x] `pnpm upg` (or its replacement) runs and reports without crashing
- [x] `@types/node` matches the runtime named by `.nvmrc` in every package that uses it
- [x] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [x] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the release notes
      read, what changed here, what was deferred
- [x] documentation contains no version numbers outside `docs/upgrades/`

## Verification

All commands ran on the runtime pinned in `.nvmrc`, through `fnm exec --using=26.13.1 --`.

```bash
pnpm install                     # after the bumps: 4 deprecated subdependencies, the
                                 # @vitejs/plugin-vue and vitest @types/node peer warnings gone,
                                 # four warnings left (typeorm→better-sqlite3, nuxt→rolldown ×2,
                                 # unctx→oxc-parser/unplugin)
pnpm why @types/node -r          # "Found 1 version of @types/node" — the runtime's major —
                                 # declared by @links/backend and @links/ui
pnpm outdated -r                 # only @nestjs/* (7), typeorm, typescript, @types/express remain
```

`@types/node` surfaced no type errors at all, so nothing was silenced and nothing was fixed:

```bash
pnpm --filter @links/backend build     # tsc -p tsconfig.build.json, no diagnostics
pnpm --filter @links/ui lib:build      # unbuild/mkdist, dist emitted, no warnings
cd packages/ui && pnpm exec vue-tsc --noEmit
# 297 errors, all under docs/ (the pre-existing docs-app debt). Measured again with the packages
# at their pre-bump versions: byte-identical output, `diff` empty. Nothing outside docs/ fails.
```

The `upg` script, dry (it has no `-w`, so it never writes):

```bash
pnpm upg    # exit 0, lists @nestjs/*, typeorm, typescript, @types/express as majors plus the
            # in-range patch/minor bumps; `git status` unchanged afterwards
```

The commit hook, both ways. It had to be wired first: this checkout was missing husky's `.husky/_`
shim and `core.hooksPath`, because the machine's `~/.npmrc` sets `ignore-scripts=true`, so
`pnpm install` never ran the root `prepare`. After `pnpm exec husky`:

```bash
git commit --allow-empty -m "bad message"
# ⧗ ... ✖ subject may not be empty [subject-empty]
#       ✖ type may not be empty [type-empty]
# husky - commit-msg script failed (code 1)          -> exit 1, no commit created

git commit --allow-empty -m "chore: probe the commit-msg hook"
# [master 74c3227] ...                               -> exit 0, commit created
git reset --soft HEAD~1                              # probe commit removed again
```

The config needed no change: `commitlint.config.mjs` still extends
`@commitlint/config-conventional`, and the hook still calls `npx --no -- commitlint --edit`.

```bash
pnpm verify    # tickets:check + lint + fmt + build + test, green: 4 test files, 62 tests, the
               # web suite exits on its own; `git status` clean afterwards
```

Two warnings remain by design, both written up in the journal: `nuxt` ↔ `rolldown` cannot be
resolved from this package set (the two build tools resolve different rolldown lines, and forcing
one would either downgrade tsdown's bundler or leave Nuxt on a version it does not support), and
the `unctx` → `oxc-parser`/`unplugin` chain belongs to the framework wave.

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- This wave touches root and multi-package devDependencies, so it is deliberately scheduled after the
  waves that touch those same manifests. Do not start it while they are unmerged.
- Raising `@types/node` to the runtime major can surface type errors in `apps/backend` and
  `packages/ui`; those are in scope to fix, unlike the pre-existing `vue-tsc` debt.
