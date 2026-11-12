---
type: ticket
id: LINKS-002
title: "Backend: native SQLite driver and TypeORM migrations"
status: done
priority: high
area: backend
created: 2026-08-14
updated: 2026-11-12
blocked_by:
  - LINKS-001
blocks:
  - LINKS-003
---

# LINKS-002 — Backend: native SQLite driver and TypeORM migrations

## What to build

The backend writes to the SQLite file through the native driver instead of the WASM driver with
implicit auto-save. The schema is versioned with TypeORM migrations, applied automatically on boot;
implicit `synchronize` is off. A working database starts from scratch through the generated baseline
migration; the existing local `data.sqlite` is simply deleted. Registration, authorization and link
CRUD work end to end against the migrated database.

## Acceptance criteria

- [x] the backend starts with the native SQLite driver; the old driver and its dependency are gone
- [x] schema changes go only through migrations: `synchronize` off, baseline migration applies to an
      empty database
- [x] registration, login (JWT + refresh session) and create/read/update/delete of links work
      against the migrated database
- [x] a developer has a generate/run/revert workflow for migrations

## Verification

Re-verified on 2026-11-12:

- `pnpm --filter @links/backend migration:show` — the CLI data source resolves and lists the baseline
  migration as pending against a freshly created `data.sqlite`
- `pnpm --filter @links/backend build` — compiles the entity set and the baseline migration
- `synchronize` is `false` in `src/database/database.config.ts`; the app module applies pending
  migrations on boot, the CLI data source does not

## Notes

The migration workflow is documented in `docs/agents/conventions.md` for whoever touches entities
next.
