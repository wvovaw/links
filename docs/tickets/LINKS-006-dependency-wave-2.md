---
type: ticket
id: LINKS-006
title: "Dependencies wave 2: backend security majors"
status: ready-for-agent
priority: high
area: backend
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-005
blocks:
  - LINKS-008
---

# LINKS-006 — Dependencies wave 2: backend security majors

## What to build

Wave 2 of the dependency campaign: the backend majors that are about correctness and security, not
about new features. Small diff, real blast radius — this wave must be proven against the API, not
only compiled.

In scope:

- `multer` → current major, plus `@types/multer` → its matching major. The backend currently declares
  the old line while `@nestjs/platform-express` already pulls the current one, so the workspace ships
  **two** multer copies; after this wave `pnpm why multer` must show one.
- `argon2` → current major (native module: rebuild and prove it loads).
- `class-validator` → current minor/major line, respecting what `@nestjs/common` supports.

Out of scope: everything in waves 3–5 (see their tickets), `@types/express` and `@nestjs/*` majors
(wave 5), any API shape change.

## Acceptance criteria

- [ ] `pnpm why multer` resolves a single version across the workspace
- [ ] upload endpoints work end to end against a running backend: avatar upload and block-image
      upload, including a rejected oversized file
- [ ] file-size limits are integers: the new multer line rejects non-integer limits, so the
      configured limits and the client must agree
- [ ] a password hashed before the `argon2` bump still verifies after it (log in with an existing
      account, not a freshly created one)
- [ ] registration, login (JWT + refresh cookie) and link create/read/update/delete pass through the
      Bruno collection in `apps/backend/.bruno`
- [ ] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [ ] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the advisory or
      release notes read, what changed here, what was deferred

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- Native modules must be rebuilt for the pinned ABI; `onlyBuiltDependencies` in `pnpm-workspace.yaml`
  already allows `argon2` and `better-sqlite3`.
- Hash compatibility is the one thing a build cannot prove: verify against a pre-existing hash before
  claiming the argon2 bump is done.
- If the Bruno collection lacks a request for a case in the acceptance criteria, add it there rather
  than testing by hand only.
