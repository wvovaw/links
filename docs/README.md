# Documentation

Index of everything a human or an agent needs beyond `AGENTS.md`.

| Path                                             | What it covers                                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [`agents/workflow.md`](agents/workflow.md)       | How work happens here: tickets, gates, definition of done, dependency upgrades, research probes |
| [`agents/conventions.md`](agents/conventions.md) | Repo layout details, tooling quirks, backend data rules, traps                                  |
| [`tickets/`](tickets/)                           | Issue tracker: one markdown file per ticket, validated by `pnpm tickets:check`                  |
| [`upgrades/`](upgrades/)                         | Dependency upgrade journal: one file per campaign, per-package evidence                         |

Related, outside `docs/`:

- `AGENTS.md` — short entry point that points here
- `.agents/skills/issue-tracker/SKILL.md` — agent skill for the tracker
- `packages/blocks/README.md` — block schema backward-compatibility flow
- `packages/ui/README.md` — UI library usage

## Two rules for this directory

1. **No version numbers.** Runtime and package versions live in `.nvmrc`, `package.json`
   (`packageManager`, `engines`, dependency ranges) and `pnpm-lock.yaml`. Docs link to them by path.
   Version numbers in prose rot silently; paths do not.
2. **Lowercase `docs/`.** One documentation directory, always lowercase, at the repo root.
