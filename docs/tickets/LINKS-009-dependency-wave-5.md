---
type: ticket
id: LINKS-009
title: "Dependencies wave 5: framework majors (TypeScript, NestJS, TypeORM)"
status: done
priority: high
area: backend
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-008
blocks: []
---

# LINKS-009 — Dependencies wave 5: framework majors (TypeScript, NestJS, TypeORM)

## What to build

Wave 5 of the dependency campaign, and the riskiest: the three majors that rewrite how the backend is
compiled, loaded and persisted. One ticket on purpose — they move together, and mixing them with any
other wave would make the failure impossible to attribute.

In scope, in this order:

1. **TypeScript** to its current major, through the intermediate major if the guide recommends it.
   The backend's `tsconfig.json` currently uses options that the new major turns into hard errors
   (`moduleResolution: "node"`, `baseUrl`). Keep one TypeScript version for the whole workspace.
2. **NestJS** to its current major: framework, `@nestjs/jwt`, `@nestjs/mapped-types`,
   `@nestjs/typeorm`, `@nestjs/platform-express`, CLI. Read the official migration guide and run its
   automated upgrade path in dry-run mode first. This major brings full ESM, Express 4 → 5 and
   `@types/express` 5, so `main.ts`, the tsconfig module settings, the CLI data source and the
   migration scripts all need review.
3. **TypeORM** to its current major: use the official codemod, then re-verify migrations on an empty
   database. `better-sqlite3` stays the only sqlite driver; the entity set is small but the migration
   baseline must still apply cleanly.

Out of scope: waves 2–4 packages (already merged by then), new features, schema changes.

## Acceptance criteria

- [x] one TypeScript version across the workspace, and no removed compiler option left in any tsconfig
- [x] `@types/express` is on the major that matches the Express version Nest actually runs
- [x] the framework upgrade's own dry run was executed and its report is summarised in the journal
- [x] the backend builds, boots on the pinned runtime, and applies the baseline migration to a deleted
      `data.sqlite` (no `synchronize`, no manual SQL)
- [x] the migration workflow still works from the CLI: `migration:show`, `migration:run`,
      `migration:revert`
- [x] registration, login (JWT + refresh cookie), link CRUD and uploads pass through the Bruno
      collection, plus one public-page read
- [x] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [x] `docs/upgrades/2026-11-dependency-majors.md` records, per major: from → to, the migration guide
      read with its link, the mechanical steps applied, what had to be changed by hand, what remains
- [x] documentation contains no version numbers outside `docs/upgrades/`

## Verification

All commands ran with `fnm exec --using=26.13.1 --` in front, from the repo root unless a path says
otherwise.

```text
pnpm verify
  tickets:check passed — 11 ticket(s), 0 warning(s)
  lint: no errors; fmt: clean; build: all four packages
  test: apps/web 4 files, 62 tests passed
  tree clean afterwards

node apps/backend/dist/main.js with DATABASE_PATH=/tmp/wave5-v12.sqlite (deleted)
  Nest application successfully started; baseline migration applied on boot
  sqlite tables: block_images, links, migrations, refresh_sessions, sqlite_sequence, users
  GET /public/links/nonexistent → 404 (route alive)

cd apps/backend && pnpm migration:show
  [ ] Baseline1786793535331            (database missing)
pnpm migration:run
  CREATE TABLE users / refresh_sessions / links / block_images
  Migration Baseline1786793535331 has been executed successfully.
pnpm migration:revert
  DROP TABLE block_images / links / refresh_sessions / users
  Migration Baseline1786793535331 has been reverted successfully.
pnpm migration:run
  Migration Baseline1786793535331 has been executed successfully.
pnpm migration:show
  [X] Baseline1786793535331

cd apps/backend/.bruno && bru run . --env local -r
  Requests 50 (50 Passed), Tests 98/98, Status ✓ PASS
  covers register, login with JWT + refresh cookie, refresh/logout/session, link CRUD,
  avatar and block-image upload, and public-page reads
  (first run on the deleted database reports 4 failed tests because the collection assumes an
  existing user and a reserved `my-new-link`; the second run is the pass above)

cd apps/backend && pnpm exec nest upgrade --dry-run   (at v11, CLI 12)
  Changes applied:
    ✔ Updated NestJS packages: @nestjs/common@^12.0.0, @nestjs/core@^12.0.0,
      @nestjs/platform-express@^12.0.0, @nestjs/cli@^12.0.0, @nestjs/jwt@^12.0.0,
      @nestjs/mapped-types@^12.0.0, @nestjs/typeorm@^12.0.0
    ✔ Scheduled "npm install"
  Dry run enabled. No files written to disk.

cd apps/backend && npx @typeorm/codemod v1 src/ --dry
  Files processed: 31, Files transformed: 0, Files skipped: 31, Parse errors: 0
  Dependency changes: typeorm ^0.3.20 → ^1.0.0

pnpm why multer -r
  Found 1 version of multer (2.5.0)

pnpm outdated -r
  no entries, exit 0

apps/backend/node_modules/.bin/tsc --version
  Version 7.0.2

pnpm --filter @links/ui lib:build
  exits 0, emits dist/index.*, dist/preset/*, dist/css/theme.css and per-component .d.ts
pnpm --filter @links/blocks build
  exits 0, emits dist/main.mjs and dist/main.d.mts
```

The TypeScript decision and the remaining peer/type-check notes are recorded in
`docs/upgrades/2026-11-dependency-majors.md` (wave 5).

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- ESM is the part most likely to break tooling rather than application code: check the CLI data
  source, the migration scripts and the compiled output path, not just `nest build`.
- If the TypeORM codemod cannot express a change, do it by hand and note it — do not leave TODO
  comments in the code.
- Deliberately last: this wave rewrites the same manifests and sources as the earlier waves, and a
  parallel run would produce conflicts instead of evidence.
