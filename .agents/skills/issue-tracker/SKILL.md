---
name: issue-tracker
description: Read and write the repo's in-repo issue tracker (docs/tickets/*.md). Use when asked to create, claim, update, close, or list tickets, to find ready or blocked work, or when a task should be recorded as a ticket instead of a chat message.
---

# Issue tracker

Tickets are markdown files in `docs/tickets/`, one file per ticket. The tracker lives in this
repository — no external app, no vault, and no checker: you validate your own edits by re-reading them
against the rules below.

Read `docs/tickets/README.md` before writing: it is the authority on fields and statuses. The
policy behind the tracker (when a ticket is allowed to be `done`) is in `docs/agents/workflow.md`.

## Where things are

| Path | Purpose |
|---|---|
| `docs/tickets/` | all tickets, flat: `<ID>-<slug>.md` |
| `docs/tickets/README.md` | conventions: frontmatter, statuses, body sections |
| `docs/tickets/_template.md` | starting point for a new ticket |

## Creating a ticket

1. Take the next free id: `ls docs/tickets/` → highest `LINKS-NNN` plus one. Never reuse an id.
2. Copy `_template.md` to `docs/tickets/<ID>-<kebab-slug>.md`.
3. Fill `title`, `status`, `priority`, `area`, `created`/`updated` (`YYYY-MM-DD`, today).
4. Write `## What to build` (what exists after this that does not exist now, plus boundaries) and
   `## Acceptance criteria` as checkboxes that can be judged without reading the diff.
5. Wire blockers on **both** sides: your `blocked_by` and the matching `blocks` entry on the ticket
   you depend on.
6. Re-read the file against **Rules you check yourself** below and fix what does not match.

A ticket without acceptance criteria is `backlog`, not `ready-for-agent`.

## Working a ticket

```bash
grep -l "status: ready-for-agent" docs/tickets/*.md  # what is ready
grep -n "blocked_by" -A3 docs/tickets/<ID>-*.md      # are its blockers done?
```

- Only `ready-for-agent` is fair game, and only if every `blocked_by` ticket is `done`.
- Set `status: claimed` in the same commit where work starts, and bump `updated`.
- Keep `blocks`/`blocked_by` in sync while you are in there.

## Closing a ticket

`done` is an evidence claim, not a feeling:

1. Check off every acceptance criterion.
2. Run `pnpm verify` (`lint` + `fmt` + `build` + `test`) — all green.
3. Add `## Verification` listing the commands you ran and what they produced, including any manual
   check (API against the Bruno collection, constructor and public page in a browser).
4. If dependency versions moved, update `docs/upgrades/`, not the ticket.
5. Bump `updated`. Follow-up work becomes a new ticket, not a comment.

`dropped` needs the reason in the body.

## Rules you check yourself

No script enforces these; you do, by reading the file you just wrote (and the ticket you linked):

- file name and `id` agree, and the id is free — take the next number, never reuse a retired one
- all fields present: `type`, `id`, `title`, `status`, `priority`, `area`, `created`, `updated`,
  `blocked_by`, `blocks`
- `status`, `priority`, `area` use the documented values and nothing else
- dates are `YYYY-MM-DD`, `updated` never earlier than `created`
- every id in `blocked_by` and `blocks` exists; `blocked_by` has no cycle
- the two lists mirror each other — if `A.blocks` names `B`, then `B.blocked_by` names `A`
- `## What to build` and `## Acceptance criteria` exist; criteria are checkboxes stating observable
  outcomes
- a `done` ticket has every criterion checked and a `## Verification` section; `dropped` says why
