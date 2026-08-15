# Issue tracker: Obsidian Vault

Issues for this repo live as markdown ticket notes in an Obsidian vault.

## Vault

- **Vault path:** `/home/wvovaw/Documents/KnowledgeBase`
- **Projects root:** `Projects`
- **Default ticket directory:** `Tickets`

## Conventions

- One project per directory: `<vault>/Projects/<Project name>/`
- Implementation issues are one file per ticket at `<vault>/Projects/<Project name>/Tickets/<PROJECTKEY>-<NNN>-<slug>.md`
- Ticket ids use an uppercase project key plus a three-digit sequence, for example `LINKS-001`
- Ticket files use YAML frontmatter for Dataview and a human-readable body for agent work
- String scalar values in frontmatter are always quoted because titles commonly contain colons or punctuation that Obsidian's YAML parser treats as syntax when unquoted
- Status is recorded in frontmatter as `status: "ready-for-agent"`, `status: "claimed"`, `status: "done"`, or another configured triage state
- Blocking edges are recorded in frontmatter as `blocked_by` and `blocks` block arrays of quoted ticket ids

## When a skill says "publish to the issue tracker"

Create one markdown file per ticket under the project's `Tickets/` directory, creating the directory if needed. Publish tickets in dependency order, blockers first.

## When a skill says "fetch the relevant ticket"

Read the ticket file by path or find it by `id` under `<vault>/Projects/*/Tickets/`.
