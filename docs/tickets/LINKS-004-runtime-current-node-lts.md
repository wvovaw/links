---
type: ticket
id: LINKS-004
title: "Runtime: move to the current Node LTS"
status: done
priority: high
area: tooling
created: 2026-11-12
updated: 2026-11-13
blocked_by: []
blocks: []
---

# LINKS-004 — Runtime: move to the current Node LTS

## What to build

The workspace runs on the Node line that is currently in Active LTS, not on the previous one. Wave
0.5 of the dependency campaign.

Scope: point `.nvmrc` at the current LTS release exactly, widen `engines.node` to it and drop the
older line, reinstall from scratch so native modules are rebuilt against the new ABI, and prove the
whole gate plus a real backend boot on the new runtime. Newer dependencies later in the campaign
declare floors that this runtime already satisfies, so the move is done first to keep every later
wave tested on the runtime it will ship with.

Out of scope: bumping `@types/node` (wave 4), package upgrades (waves 1–5).

## Acceptance criteria

- [x] `.nvmrc` names the current LTS release exactly; `engines.node` accepts that release and no
      longer admits the previous line
- [x] clean install on the new runtime links every native module with a usable binary
      (`argon2`, `better-sqlite3`, `sharp`, `esbuild`, `vue-demi`)
- [x] `pnpm verify` green on the new runtime
- [x] the backend boots on the new runtime and applies pending migrations
- [x] no runtime or package version was introduced into repo documentation

## Notes

Exact release numbers belong in `docs/upgrades/2026-11-dependency-majors.md`, not here or in prose
docs. If a native module lacks a prebuilt binary for the new ABI, it is allowed to compile from
source — the workspace allowlists native builds in `pnpm-workspace.yaml`.

## Verification

Run on 2026-11-13 with the new runtime active:

- clean `node_modules` (all workspace packages removed), `pnpm install` — locked, no prompts; every
  allowlisted native module exposes a working binary: `better-sqlite3` opened an in-memory database
  and ran a query, `argon2` produced a hash
- `pnpm verify` — exit 0: tracker valid, lint and format clean, every package builds, web suite green
- backend on a deleted `data.sqlite`: `node dist/main.js` applied the baseline migration on boot, the
  `migrations` table holds it, then `GET /public/links/<missing>` answered 404 and `GET /links` 401
- `pnpm --filter @links/backend migration:run` on another empty database executed the baseline
- `grep` over `AGENTS.md` and `docs/` shows no runtime or package version in prose

Two defects surfaced while moving the runtime and were fixed in this ticket:

- the gate ran tests before the build, but the web suite loads the UI preset from dist — on a fresh
  clone the tests could never pass. `pnpm verify` and CI now build before testing.
- the web build could start before Nuxt had written `.nuxt/tsconfig.json`; the build script now runs
  `nuxt prepare` first, which makes a cold build deterministic.
