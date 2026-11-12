---
type: ticket
id: LINKS-003
title: "Docs: AGENTS.md describes the real toolchain and data layer"
status: done
priority: medium
area: docs
created: 2026-08-14
updated: 2026-11-12
blocked_by:
  - LINKS-001
  - LINKS-002
blocks: []
---

# LINKS-003 — Docs: AGENTS.md describes the real toolchain and data layer

## What to build

The repo's agent documentation honestly describes the current toolchain and data storage: pinned
runtime and package manager, no hoisting, native SQLite driver with migrations. Agents stop following
stale instructions (the old WASM-driver gotcha, outdated runtime and package-manager majors,
`shamefully-hoist`).

## Acceptance criteria

- [x] AGENTS.md contains no mention of the WASM driver, no outdated runtime/package-manager majors,
      no `shamefully-hoist`
- [x] the backend migration workflow is documented for agents

## Verification

Re-verified on 2026-11-12 after the documentation restructure:

- `grep -ri "sql.js\|shamefully-hoist" AGENTS.md docs/` — no matches
- `grep -rE "[0-9]+\.[0-9]+" AGENTS.md docs/` — no runtime or package version numbers in prose
- the migration workflow lives in `docs/agents/conventions.md` and the tracker rules in
  `docs/agents/workflow.md`

## Notes

Superseded in intent by the documentation restructure: `AGENTS.md` is now a short entry point, detail
lives in `docs/`. The "no stale versions in prose" goal is now a standing rule in
`docs/agents/workflow.md` rather than a one-off cleanup.
