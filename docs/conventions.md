# Conventions and traps

Knowledge that is expensive to rediscover. Versions are deliberately absent — they live in
`.nvmrc`, each `package.json` and `pnpm-lock.yaml`.

## Writing docs

- English markdown, one topic per file, real paths. **No version numbers in prose** — link `.nvmrc`,
  `package.json#packageManager`/`engines`, or a package's `package.json` instead.
- Lowercase `docs/` at the repo root is the only documentation directory. `AGENTS.md` stays short;
  detail belongs here, procedures in `.agents/skills/`.
- Docs describe the repo as it is. When behaviour changes, the doc change ships with the same
  commit.

## Tooling

- **oxlint + oxfmt**, not eslint/prettier. Each package extends the shared `codestyle` package via
  its own `oxlint.config.*` / `oxfmt.config.*` and passes it explicitly with `--config`.
- `lint` / `fmt` are read-only; `lint:fix` / `fmt:write` are the writing variants. CI runs the
  read-only pair, so a "green local lint" that reformatted files is a false green.
- `pnpm -r <script>` silently **skips** packages that do not define the script. Add it to the
  package before wiring it at the root.
- This Node line ships without corepack: if `pnpm` is missing, install the version named by
  `package.json#packageManager` with `npm i -g` into that runtime.
- `pnpm` runs dependency install scripts only for packages allowlisted in `onlyBuiltDependencies`
  (`pnpm-workspace.yaml`); a native dependency missing from it installs without its binary. A
  user-level `ignore-scripts=true` in `~/.npmrc` disables every install script, so `prepare` (husky)
  silently does nothing and a fresh store produces binary-less natives. Check that first when a hook
  stops firing.
- No root `.npmrc`: packages see only what they declare. An undeclared import may work by hoisting
  and break later.
- Conventional commits are enforced by husky + commitlint on `commit-msg`.
- `apps/web` tests with vitest + happy-dom + `@nuxt/test-utils`; `apps/backend` with vitest +
  `@nestjs/testing` + supertest against an in-memory better-sqlite3 (`apps/backend/test/`). The
  Bruno collection in `apps/backend/.bruno` remains the check for real HTTP and file behaviour.
- **Backend tests compile through SWC** (`unplugin-swc` in `vitest.config.mts`), not esbuild: NestJS
  DI reads `design:paramtypes`, which esbuild cannot emit. Same reason makes `import type`
  mandatory for type-only imports — SWC has no type information, so a plain import of a type
  survives into the runtime graph and fails to resolve. That includes migrations, which TypeORM
  loads through Node rather than through the test bundler.
- **A toolchain change can leave a poisoned `node_modules`.** Stale symlinks into a `.pnpm` path
  that no longer exists make resolution die with `ENOENT ... realpath` on a package that looks
  installed. `find node_modules -maxdepth 2 -xtype l` finds them; the fix is
  `rm -rf node_modules packages/*/node_modules apps/*/node_modules && pnpm install`. CI starts
  clean, so this failure is local-only and easy to misread as a regression.

## Workspace packages are consumed via dist

`apps/web` imports `@links/ui` and `@links/blocks` from their built `dist/`. Editing library sources
requires a rebuild before web sees the change:

```bash
pnpm --filter @links/ui lib:build      # unbuild/mkdist
pnpm --filter @links/blocks build      # tsdown
```

Root `pnpm build` is recursive and ordered, so it builds both libraries before web. `pnpm install`
does **not** build them — `prepare` fires for installed dependencies, not workspace links — so a
fresh clone must be built before anything importing the preset runs, the web tests included.

## apps/web (Nuxt) — two directories per feature

- Nuxt defaults live in `app/`: thin route shells in `app/pages/...` with `definePageMeta` and
  middleware that render page components from the FSD tree.
- Real page components live in `src/{pages,features,entities,widgets,shared}`, imported through the
  aliases `~pages`, `~features`, `~entities`, `~widgets`, `~shared` (see `nuxt.config.ts`).
- Adding a route = a shell in `app/pages/<route>/index.vue` **and** a component in
  `src/pages/<route>/ui/<name>-page.vue`.
- i18n: `src/shared/locales/en-US.ts` and `ru-RU.ts`; default `en`, strategy `prefix_and_default`.
- The API is reached through runtime config `public.backendUrl` (env `NUXT_PUBLIC_BACKEND_URL`, see
  `.env.example`); uploaded images resolve against it, `public.baseUrl` builds public link URLs.
- Blocks render by resolving a component per block name
  (`src/shared/blocks/use-blocks-resolver.ts`); a block receives `properties` and falls back to theme
  CSS variables for unset values.
- Content (MDC docs) lives in `apps/web/content/`; `packages/ui/docs/` is a separate Nuxt site.

## apps/backend — data and migrations

- TypeORM over **better-sqlite3**, writing a gitignored `data.sqlite` next to the package. Options
  live in `src/database/database.config.ts`, shared by `TypeOrmModule.forRoot` and the CLI data
  source (`src/data-source.ts`).
- `synchronize: false`: schema changes only through migrations in `src/migrations/`. The app applies
  pending migrations on boot; the CLI data source does not, so generate/revert stay explicit.
- Dev loop, from `apps/backend`: edit entities, then `pnpm migration:generate src/migrations/<Name>`,
  then `migration:run` / `migration:revert` / `migration:show`. Generation diffs against the
  _current_ database, so run pending migrations first.
- A `data.sqlite` predating migrations has no `migrations` table and collides with the baseline —
  delete the file and let migrations rebuild it.
- Env is read straight from `process.env`, each variable at its point of use with an inline default.

| Variable        | Read in                                                     |
| --------------- | ----------------------------------------------------------- |
| `PORT`          | `main.ts`                                                   |
| `FRONTEND_URL`  | `main.ts` (CORS origin)                                     |
| `DATABASE_PATH` | `database/database.config.ts`                               |
| `UPLOADS_PATH`  | `storage/local-storage.service.ts`                          |
| `IMAGES_PATH`   | `storage/local-storage.service.ts`                          |
| `JWT_SECRET`    | `auth/auth.tokens.ts` — required in production              |
| `NODE_ENV`      | `auth/auth.controller.ts` — gates the secure refresh cookie |

- Auth: JWT access tokens plus cookie-based refresh sessions. Uploads go through multer into
  `apps/backend/uploads` (gitignored).

## blocks versioning

`packages/blocks/README.md` documents the mandatory backward-compatibility flow: bump
`BLOCK_VERSION` in the factory, add a step to `migrateBlock`, handle the version change in
components. Read it before touching block schemas.

## Ports

Backend, web, the UI docs site and the blocks watcher all run from `pnpm dev`; ports are the ones
configured per package, and `NUXT_PUBLIC_BACKEND_URL` must agree with the backend's port.

## Subagents

The subagent roster lives in `.pi/agents/` and only those agents run: `.pi/settings.json` sets
`subagents.agentScope: "project"` and disables the bundled ones, so an agent missing here does not
exist. Each file pins its own model, thinking level and tool allowlist. Tool access is a strict
allowlist (`tools`), never a deny-list: what an agent does not name it cannot call, and a typo fails
the launch instead of silently granting nothing.

The same model and thinking pins are repeated in `subagents.agentOverrides`, and that duplication is
load-bearing: a user-level `agentOverrides.<name>` beats project frontmatter, so the project copy is
the only thing that keeps the models and thinking levels the same on someone else's machine. It does
not cover the other fields — a user-level override that sets `tools` still wins. Change both or
neither.

Prompt bodies are copied from the bundled `pi-subagents` agents (`worker` is our `implementer`), so
upstream fixes arrive by re-copying the body and keeping the frontmatter. Only frontmatter is ours.

`implementer` and `reviewer` name the project skills they can load (`skills:`), because
`inheritSkills: false` is what keeps every other skill out. An agent with no `skills:` line sees none
of them, and a skill it was not given cannot be invoked.

`codemode` is on every agent: it batches reads and searches into one script. From a script an agent
cannot call `contact_supervisor`, `subagent`, or `structured_output` — escalation stays a direct call.

Everything except `implementer` carries `async: true`. Four reasons, all of them launch-time failures
in a foreground child: `mcp:qmd` and `watchdog_diff` come from extensions, and `web_search`,
`fetch_content`, `get_search_content`, `source_check` come from `pi-web-access`. A foreground launch
of such an agent dies before its first turn.

Read "read-only" in an agent file as a role, not an enforcement. Only the tool allowlist is technical.
`reviewer` and `oracle` keep `bash` from their bundled prompts, so the bar on them is their prompt
plus review, not a sandbox.

### MCP

Pi's native MCP is disabled (`-builtin:mcp`) and `pi-mcp-adapter` owns MCP. The `qmd` server lives in
`~/.config/mcp/mcp.json`, and that location is the point: `pi-subagents` resolves an agent's `mcp:`
selectors against exactly four files —

- `~/.config/mcp/mcp.json`
- `~/.pi/agent/mcp-adapter.json`
- `<repo>/.mcp.json`
- `<repo>/.pi/mcp-adapter.json`

— and never against Pi's own `~/.pi/agent/mcp.json`, whose servers it treats as built-in MCP. A server
that lives only there reaches the main session and no child: `mcp:qmd` fails the launch with
`Unresolved MCP direct-tool selectors`. A `<repo>/.mcp.json` resolves but needs interactive approval,
and a child cannot approve, so it is blocked there too — tried and reverted.

An agent names the server (`mcp:qmd`) or a single tool (`mcp:qmd/query`), must run `async: true`, and
gets the tools under their adapter names (`qmd_query`, `qmd_get`, `qmd_multi_get`, `qmd_status`). The
`mcp` gateway tool stays available for discovery. An agent with `bash` can always fall back to the
`qmd` CLI.

The qmd index holds a `links` collection covering this repo's `**/*.md`. Pass `collections: ["links"]`
to keep results inside the repo — the index also holds unrelated projects, and an unfiltered query
happily answers from them. Re-index with `qmd update && qmd embed -c links` after documentation
changes; a stale index answers confidently from deleted text.

| Agent         | Model                                          | Thinking | Purpose                            |
| ------------- | ---------------------------------------------- | -------- | ---------------------------------- |
| `implementer` | `openrouter/deepseek/deepseek-v4.1-flash-1017` | high     | Writes code, tests, commits        |
| `reviewer`    | `openrouter/minimax/minimax-m3.1-flash`        | high     | Reviews diffs and plans, read-only |
| `scout`       | `openrouter/deepseek/deepseek-v4.1-flash-1017` | low      | Recon; writes `context.md`         |
| `researcher`  | `openrouter/deepseek/deepseek-v4.1-flash-1017` | high     | Sourced web research brief         |
| `oracle`      | `openrouter/z-ai/glm-5.3`                      | high     | Second opinion before acting       |
