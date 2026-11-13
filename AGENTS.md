# AGENTS.md

Entry point for agents. Repo-specific knowledge lives in [`docs/conventions.md`](docs/conventions.md).

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

Documentation in this repo contains **no runtime or package version numbers**.

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
5. One documentation directory: lowercase `docs/` at the root. Docs contain no version numbers.

## Working rules

- State what you will do, then do it. Smallest change that fully solves the task.
- Before saying something works, run it. `pnpm verify` is the floor for anything touching packages;
  runtime behaviour also gets exercised — the API through its Bruno collection
  (`apps/backend/.bruno`), the constructor and a public page in a browser.
- Docs describe the repo as it is: a behaviour change and its doc change are one commit.
- Conventional commits — enforced by husky + commitlint.

## Agent tooling

- Skills live in [`.agents/skills/`](.agents/skills/), declared by `skills-lock.json`, installed with
  `npx skills add <owner/repo@skill>` (project scope — no `-g`). Installed: Vue best practices,
  Vue testing, Pinia, NestJS, UnoCSS, ponytail.
- Superpowers (brainstorming, writing-plans, TDD, code review, verification) is a Pi package
  declared in `.pi/settings.json`. It loads only after project trust is granted.
