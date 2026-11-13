# AGENTS.md

Entry point for agents working in this repo. Anything longer than a screen lives in `docs/`.

## What the repo is

A multilink page builder: a user assembles a public page out of blocks (link, image, text, …) in a
constructor and publishes it under a short slug. A NestJS API plus a Nuxt frontend, with two shared
workspace libraries — a UI kit and a blocks factory.

## Workspace layout

| Path                 | Package          | What it is                                                       |
| -------------------- | ---------------- | ---------------------------------------------------------------- |
| `apps/backend`       | `@links/backend` | NestJS API                                                       |
| `apps/web`           | `@links/web`     | Nuxt frontend: constructor, public pages, docs                   |
| `packages/ui`        | `@links/ui`      | Vue component library + UnoCSS preset, built with unbuild/mkdist |
| `packages/blocks`    | `@links/blocks`  | block factory/registry and block schema migrations               |
| `packages/codestyle` | `codestyle`      | shared oxlint + oxfmt configs                                    |

## Where the truth lives

Never restate these in prose — link the file instead:

- runtime version → `.nvmrc`
- package manager version → `package.json#packageManager`
- allowed native builds → `onlyBuiltDependencies` in `pnpm-workspace.yaml`
- dependency versions → each package's `package.json` and `pnpm-lock.yaml`

Documentation in this repo contains **no runtime or package version numbers**. See
`docs/agents/workflow.md` for the rule in context.

## Commands

| Command          | Meaning                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `pnpm install`   | workspace install (does **not** build the libraries — run `pnpm build`) |
| `pnpm dev`       | parallel dev servers: backend, web, ui docs, blocks watcher             |
| `pnpm build`     | recursive build in dependency order, `@links/ui` included               |
| `pnpm lint`      | lint, **read-only**                                                     |
| `pnpm lint:fix`  | lint with autofix — edits files                                         |
| `pnpm fmt`       | format check, **read-only**                                             |
| `pnpm fmt:write` | format write — edits files                                              |
| `pnpm test`      | recursive tests                                                         |
| `pnpm verify`    | `lint` + `fmt` + `build` + `test` — the gate                            |

Target one package with `pnpm --filter <name> …`. Recursive scripts silently skip packages that do
not define them.

## Hard invariants

1. `apps/web` consumes `@links/ui` and `@links/blocks` **from their built dist**. Editing library
   sources requires a rebuild before web sees the change — and so does running the web tests, which
   load the UI preset through `uno.config.ts`.
2. Backend schema changes go through TypeORM migrations only — `synchronize` is off.
3. Block schema changes follow the backward-compatibility flow in `packages/blocks/README.md`.
4. `lint` / `fmt` never write. When you mean to change files, use `lint:fix` / `fmt:write`.

## Documentation map

- `docs/agents/workflow.md` — how work happens: tickets, gates, definition of done, dependency
  upgrades, research probes
- `docs/agents/conventions.md` — repo layout details and traps
- `docs/tickets/` — the issue tracker, in-repo markdown
- `docs/upgrades/` — dependency upgrade journal
- `.agents/skills/issue-tracker/` — the skill that drives the tracker
