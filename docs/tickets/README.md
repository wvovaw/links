# Tickets

The issue tracker for this repository. Plain markdown, one file per ticket, no external tool and no
vault: the tracker travels with the code it describes.

The agent-facing procedure for using it is the `.agents/skills/issue-tracker` skill. The rules that
govern _when_ a ticket exists and what "done" means are in
[`docs/agents/workflow.md`](../agents/workflow.md).

## Files

```
docs/tickets/
├── README.md                       # this file
├── _template.md                    # starting point for a new ticket
├── LINKS-001-some-slug.md
└── LINKS-002-another-slug.md
```

- File name: `<ID>-<slug>.md`, slug is lowercase kebab-case.
- `ID` is `LINKS-<NNN>`, three digits, sequential. Take the next free number — never reuse one.
- One file, one ticket. History stays in git; there is no archive directory.

## Frontmatter

```yaml
---
type: ticket # always "ticket"
id: LINKS-042 # must match the file name prefix
title: "Imperative statement of the deliverable"
status: ready-for-agent # see the table below
priority: high # low | medium | high
area: backend # backend | web | ui | blocks | tooling | docs
created: 2026-11-12 # YYYY-MM-DD
updated: 2026-11-12 # YYYY-MM-DD, bumped on every edit
blocked_by: [] # ticket ids that must be done first
blocks: [] # ticket ids that cannot start until this one is done
---
```

| Status            | Meaning                                                         |
| ----------------- | --------------------------------------------------------------- |
| `backlog`         | captured, not ready to start (missing decisions or criteria)    |
| `ready-for-agent` | criteria are clear, blockers are done, free to claim            |
| `claimed`         | someone is working on it right now                              |
| `review`          | implementation finished and verified, waiting for acceptance    |
| `done`            | accepted; acceptance criteria checked, `## Verification` filled |
| `dropped`         | abandoned; the body says why                                    |

`blocked_by` and `blocks` are mirror images of each other: if `A.blocks` contains `B`, then
`B.blocked_by` must contain `A`. Keep both sides in sync.

## Body

Required sections: `## What to build`, `## Acceptance criteria`. Required for `status: done`:
`## Verification` (what was actually run and what came out). Optional: `## Notes`.

Acceptance criteria are checkboxes. A ticket with unchecked criteria cannot be `done`.

## Validation

```bash
pnpm tickets:check
```

The script (`scripts/tickets-check.mjs`, no dependencies) enforces: file naming and id agreement,
required fields, allowed enum values, date formats, unique ids, resolvable and acyclic blockers,
required sections, and checked criteria for done tickets. It runs in CI, so a broken tracker fails
the build instead of quietly rotting.
