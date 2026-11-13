---
type: ticket
id: LINKS-013
title: "Drop the ticket validation script; keep the contract in the skill"
status: done
priority: medium
area: tooling
created: 2026-11-13
updated: 2026-11-13
blocked_by: []
blocks: []
---

# LINKS-013 — Drop the ticket validation script; keep the contract in the skill

## What to build

The tracker is validated by `scripts/tickets-check.mjs`, wired into `pnpm tickets:check`, into
`pnpm verify`, into CI, and referenced from five documents. That is more machinery than the tracker
earns: it is a handful of markdown files, and an agent editing them can follow the written contract
without an executable enforcer. A script in the project's `scripts/` directory also puts tracker
semantics in the wrong place — the contract belongs to the tracker itself and to the skill that
operates it.

Remove the script and everything that only exists to call it. Keep the contract as written rules, and
make the skill state plainly that whoever edits a ticket checks it against those rules by reading them.

Scope, in the order that leaves the repo working:

1. Delete `scripts/tickets-check.mjs`, and the `scripts/` directory if it becomes empty.
2. Root `package.json`: drop the `tickets:check` script; drop `tickets:check` from `verify`; remove the
   now-dead `scripts` argument from `lint`, `lint:fix`, `fmt` and `fmt:write` (those commands currently
   pass `scripts` explicitly, so they must not point at a directory that no longer exists).
3. `.github/workflows/ci.yml`: remove the ticket-validation step.
4. `AGENTS.md`: remove the `pnpm tickets:check` row and correct the `verify` row.
5. `docs/tickets/README.md`: replace the `## Validation` section with the rules an editor has to honour,
   as prose — no script, no command. The frontmatter contract stays as it is.
6. `docs/agents/workflow.md`: the definition of done currently starts with "`tickets:check` passes";
   replace that with the reading rule, and fix the `verify` breakdown wherever it lists the removed step.
7. `.agents/skills/issue-tracker/SKILL.md`: drop the validator references and the "rules that the
   validator enforces" framing; state the contract directly, and say that after editing a ticket the
   agent re-reads it against those rules (including blocker symmetry and no cycles) instead of running
   a checker.
8. Leave historical mentions in `docs/upgrades/` and in closed tickets alone: they record what was run
   at the time and are not instructions.

Out of scope: changing the frontmatter schema, the status vocabulary, ticket ids, or moving the
tracker out of `docs/tickets/`.

## Acceptance criteria

- [x] `scripts/` no longer exists, or contains nothing ticket-related
- [x] `grep -rn "tickets:check\|tickets-check"` finds nothing outside `docs/upgrades/` and closed
      ticket `## Verification` sections
- [x] `pnpm verify` runs clean end to end (`lint`, `fmt`, `build`, `test`) with no missing-path errors
      from the removed `scripts` directory
- [x] CI runs the same steps as `pnpm verify` and nothing more
- [x] `docs/tickets/README.md`, `docs/agents/workflow.md` and the skill each state the tracker rules
      as instructions an editor follows by reading, with no reference to a checker
- [x] a freshly written ticket can be judged correct using only those documents — sanity-check by
      describing one, not by writing a tool

## Notes

- Raised while reviewing the campaign: the script lives in project `scripts/` while the rules live in
  docs and the skill, which splits one contract across two places and implies the docs alone are not
  enough.
- The removed script currently enforces: file-name/id agreement, required fields, allowed
  `status`/`priority`/`area`, date formats with `updated >= created`, unique ids, resolvable and
  acyclic blockers, `## What to build` + `## Acceptance criteria`, and a `## Verification` section
  (with all criteria checked) for `done`. Those rules must survive as prose, not disappear.

## Verification

- `scripts/tickets-check.mjs` deleted; `scripts/` no longer exists (`ls -d scripts` → missing)
- root `package.json`: `tickets:check` gone, `verify` is now `lint && fmt && build && test`, and the
  dead `scripts` argument was dropped from `lint`, `lint:fix`, `fmt`, `fmt:write`
- `.github/workflows/ci.yml` runs install → lint → fmt → build → test, with no ticket step
- `grep -rn "tickets:check\|tickets-check"` over the tracked markdown/config leaves only the
  historical `## Verification` sections of the closed campaign tickets and this ticket's own scope
  description — no instruction anywhere still points at a checker
- `pnpm verify` on the pinned runtime: exit 0 — lint and format clean, every package builds, 62 tests
  pass; no missing-path errors after the `scripts` argument was removed
- the rules carried over rather than disappearing: the list the script enforced is now prose in
  `docs/tickets/README.md` under "Editing a ticket" and in the skill under "Rules you check yourself"
- sanity check was done before the removal: this ticket was authored by hand from `_template.md` and
  reviewed against the written rules, with no tool involved
