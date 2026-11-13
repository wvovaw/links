# Dependency upgrades

One file per upgrade campaign: `YYYY-MM-<slug>.md`. A campaign is a batch of version bumps executed
in waves; the file is its log and its checklist.

## What an entry records

For every package that moves:

- **from → to**, and the official migration guide or release notes that were read before bumping —
  with a link, not a summary from memory
- **what changed** in this repo as a result: config, scripts, imports, API calls
- **what was deferred** and why (a follow-up ticket reference, not a promise)
- **how it was verified**: install, build, tests, and the manual check that actually exercised the
  behaviour (API against the Bruno collection, constructor, public page)

## Versions are allowed here

This directory is the one place in `docs/` where version numbers belong: it is a _historical_ record
of a migration, not reference documentation. It must not be used to answer "what version do we run
now" — that answer always comes from `package.json` and `pnpm-lock.yaml`. Outside this directory the
no-versions rule in [`docs/agents/workflow.md`](../agents/workflow.md) still holds.

## Rules

- One wave per commit series; formatting churn and lockfile churn from peer resolution get their own
  commits.
- Framework majors (NestJS, TypeORM, TypeScript, Nuxt) each get their own ticket, even inside one
  wave.
- A wave is finished when `pnpm verify` is green and the campaign file says what was verified.
- Anything left undone is a ticket in `docs/tickets/`, linked from the campaign file.
