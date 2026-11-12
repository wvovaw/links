---
name: issue-tracker
description: Read and write the repo's in-repo issue tracker (docs/tickets/*.md). Use when asked to create, claim, update, close, or list tickets, to find ready or blocked work, or when a task should be recorded as a ticket instead of a chat message.
---

# Issue tracker

Tickets are markdown files in `docs/tickets/`, one file per ticket, validated by
`pnpm tickets:check`. The tracker lives in this repository — no external app, no vault.

Read `docs/tickets/README.md` before writing: it is the authority on fields and statuses. The
policy behind the tracker (when a ticket is allowed to be `done`) is in `docs/agents/workflow.md`.

## Where things are

| Path | Purpose |
|---|---|
| `docs/tickets/` | all tickets, flat: `<ID>-<slug>.md` |
| `docs/tickets/README.md` | conventions: frontmatter, statuses, body sections |
| `docs/tickets/_template.md` | starting point for a new ticket |
| `scripts/tickets-check.mjs` | validator behind `pnpm tickets:check` |

## Creating a ticket

1. Take the next free id: `ls docs/tickets/` → highest `LINKS-NNN` plus one. Never reuse an id.
2. Copy `_template.md` to `docs/tickets/<ID>-<kebab-slug>.md`.
3. Fill `title`, `status`, `priority`, `area`, `created`/`updated` (`YYYY-MM-DD`, today).
4. Write `## What to build` (what exists after this that does not exist now, plus boundaries) and
   `## Acceptance criteria` as checkboxes that can be judged without reading the diff.
5. Wire blockers on **both** sides: your `blocked_by` and the matching `blocks` entry on the ticket
   you depend on.
6. Run `pnpm tickets:check`.

A ticket without acceptance criteria is `backlog`, not `ready-for-agent`.

## Working a ticket

```bash
pnpm tickets:check                                   # tracker is healthy before you start
grep -l "status: ready-for-agent" docs/tickets/*.md  # what is ready
```

- Only `ready-for-agent` is fair game, and only if every `blocked_by` ticket is `done`.
- Set `status: claimed` in the same commit where work starts, and bump `updated`.
- Keep `blocks`/`blocked_by` in sync while you are in there.

## Closing a ticket

`done` is an evidence claim, not a feeling:

1. Check off every acceptance criterion.
2. Run `pnpm verify` (`tickets:check` + `lint` + `fmt` + `test` + `build`) — all green.
3. Add `## Verification` listing the commands you ran and what they produced, including any manual
   check (API against the Bruno collection, constructor and public page in a browser).
4. If dependency versions moved, update `docs/upgrades/`, not the ticket.
5. Bump `updated`. Follow-up work becomes a new ticket, not a comment.

`dropped` needs the reason in the body.

## Rules that the validator enforces

File name and `id` agree; required fields present; `status`, `priority`, `area` from the allowed sets;
dates `YYYY-MM-DD` with `updated >= created`; ids unique; blockers exist and contain no cycles;
`## What to build` and `## Acceptance criteria` present; `done` tickets have `## Verification` and no
unchecked criteria. Asymmetric `blocks`/`blocked_by` pairs are warnings.
