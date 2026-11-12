---
type: ticket
id: LINKS-009
title: "Dependencies wave 5: framework majors (TypeScript, NestJS, TypeORM)"
status: backlog
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

- [ ] one TypeScript version across the workspace, and no removed compiler option left in any tsconfig
- [ ] `@types/express` is on the major that matches the Express version Nest actually runs
- [ ] the framework upgrade's own dry run was executed and its report is summarised in the journal
- [ ] the backend builds, boots on the pinned runtime, and applies the baseline migration to a deleted
      `data.sqlite` (no `synchronize`, no manual SQL)
- [ ] the migration workflow still works from the CLI: `migration:show`, `migration:run`,
      `migration:revert`
- [ ] registration, login (JWT + refresh cookie), link CRUD and uploads pass through the Bruno
      collection, plus one public-page read
- [ ] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [ ] `docs/upgrades/2026-11-dependency-majors.md` records, per major: from → to, the migration guide
      read with its link, the mechanical steps applied, what had to be changed by hand, what remains
- [ ] documentation contains no version numbers outside `docs/upgrades/`

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- ESM is the part most likely to break tooling rather than application code: check the CLI data
  source, the migration scripts and the compiled output path, not just `nest build`.
- If the TypeORM codemod cannot express a change, do it by hand and note it — do not leave TODO
  comments in the code.
- Deliberately last: this wave rewrites the same manifests and sources as the earlier waves, and a
  parallel run would produce conflicts instead of evidence.
