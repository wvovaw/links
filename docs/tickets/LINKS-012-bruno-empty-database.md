---
type: ticket
id: LINKS-012
title: "Bruno collection: run clean on an empty database"
status: ready-for-agent
priority: medium
area: backend
created: 2026-11-13
updated: 2026-11-13
blocked_by: []
blocks: []
---

# LINKS-012 — Bruno collection: run clean on an empty database

## What to build

The API smoke collection in `apps/backend/.bruno` is only trustworthy on its second run. On a freshly
migrated, empty database the first `bru run . --env local -r` reports failures that are not defects:

- the register request asserts `200|409`, but the API answers `201` on a fresh account;
- at least two checks assume a specific slug (`my-new-link`) is already taken, which is only true
  after a previous run created it.

The collection is the evidence base for backend changes; it must pass on the first run against an
empty database and on every subsequent run, without depending on leftover state.

## Acceptance criteria

- [ ] against a freshly migrated, empty database, a single `bru run . --env local -r` passes every
      request and test — no second run needed
- [ ] a second consecutive run passes as well, so the suite is idempotent
- [ ] duplicate/conflict checks create the state they assume instead of relying on a previous run
- [ ] request order inside the collection is no longer load-bearing: a folder or a single request
      that needs a prerequisite states it in its own pre-request script
- [ ] the collection's own README (or the `## Notes` of the request) documents how to reset to a
      clean state
- [ ] `pnpm verify` still green on the pinned runtime

## Notes

- Found during wave 5 of the dependency campaign: the first run on a deleted `data.sqlite` reported
  four failures, the second run was fully green.
- Keep using the collection rather than inventing a parallel script: it is the documented way this
  repo exercises the API.
