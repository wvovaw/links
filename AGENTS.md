# AGENTS.md

pnpm 8 monorepo (`pnpm-workspace.yaml`). Node 20. `.npmrc` sets `shamefully-hoist=true`. Branch: `master`.

## Agent skills

### Issue tracker

Issues are tracked as Obsidian vault ticket notes. See `docs/agents/issue-tracker.md`.

## Workspace layout

| Path | Package | What it is |
|---|---|---|
| `apps/backend` | `@links/backend` | NestJS 10 API (port 3001) |
| `apps/web` | `@links/web` | Nuxt 4 frontend (port 3000) |
| `packages/ui` | `@links/ui` | Vue component library + UnoCSS preset, built with unbuild/mkdist |
| `packages/blocks` | `@links/blocks` | Multilink page "block" factory/registry, built with tsdown |
| `packages/codestyle` | `codestyle` | Shared oxlint + oxfmt configs (exports `codestyle/oxlint`, `codestyle/oxfmt`) |

## Commands

- `pnpm install` — workspace install (runs each package's `prepare`, which builds `ui`/`blocks` dist).
- `pnpm dev` — parallel dev: backend watch (3001), web (3000), ui docs (3002), blocks `tsdown -w`.
- `pnpm build` / `pnpm lint` / `pnpm fmt` / `pnpm test` — run recursively; target one package with `pnpm --filter <name> …`.
- Lint/format is **oxlint/oxfmt**, not eslint/prettier. Each package extends the shared `codestyle` config; per-package configs are `oxlint.config.*` / `oxfmt.config.*`.
- **`pnpm lint` auto-fixes** (`oxlint . --fix`) in `web`, `ui`, and `blocks` — running it edits files. Backend lint does not.
- Root `.vscode/settings.json` still points at a stale `packages/configurable-codestyle/` config path; the real package is `packages/codestyle`.
- `pnpm upg` = `taze -r` for dependency upgrades.

## Workspace packages are consumed via dist

`apps/web` imports `@links/ui` and `@links/blocks` from their built `dist/`. Editing source in `packages/ui` or `packages/blocks` requires a rebuild before web sees it:
- `pnpm --filter @links/ui lib:build` (unbuild)
- `pnpm --filter @links/blocks build` (tsdown)

## apps/web (Nuxt 4) — two directories per feature

- Nuxt defaults live in `apps/web/app/`: **thin route shells** (`app/pages/...`) with `definePageMeta`/middleware that render page components from the FSD tree.
- Real page components live in FSD layout under `apps/web/src/{pages,features,entities,widgets,shared}`, imported via aliases `~pages`, `~features`, `~entities`, `~widgets`, `~shared` (defined in `nuxt.config.ts`).
- Adding a route = create a shell in `app/pages/<route>/index.vue` **and** a page component under `src/pages/<route>/ui/<name>-page.vue`.
- i18n: locale files in `src/shared/locales/en-US.ts` and `ru-RU.ts`; default `en`, `prefix_and_default` strategy.
- Web calls the backend via runtime config `public.backendUrl` (env `NUXT_PUBLIC_BACKEND_URL`, see `apps/web/.env`); also used to build uploaded-image URLs. `public.baseUrl` is used for public link URLs.
- Content (MDC docs) in `apps/web/content/`; `packages/ui/docs/` is a separate Nuxt docs site for the UI library.

## apps/backend (NestJS) — sql.js gotcha

- Persistence is TypeORM + **sql.js** (SQLite WASM, in-memory with `autoSave: true`), stored to `data.sqlite` in `apps/backend` (gitignored).
- `synchronize: true` — schema is derived from entities, no migration files; entity edits change the schema directly.
- Env is read straight from `process.env` (no dotenv/ConfigModule): `PORT` (default 3001), `FRONTEND_URL` (default `http://localhost:3000`), `DATABASE_PATH`.
- Auth: JWT access tokens + cookie-based refresh sessions; file uploads via multer into `apps/backend/uploads` (gitignored).
- API collections for Bruno live in `apps/backend/.bruno`.

## blocks versioning (read before touching)

`packages/blocks/README.md` documents a mandatory backward-compat migration flow: bump `BLOCK_VERSION` in the factory, add a step to `migrateBlock`, and handle the version change in components. Read it before changing block schemas.

## Testing

- Only `apps/web` has tests (vitest, happy-dom, `@nuxt/test-utils`); run with `pnpm --filter @links/web test` or single file via `vitest run <path>`. No backend tests exist.

## Commits & CI

- Conventional commits enforced by husky + commitlint (`commit-msg` hook). Changesets for versioning (`pnpm changeset`, base branch `master`).
- `.github/workflows/ui.deploy.yml` builds the repo and deploys `packages/ui` docs to GitHub Pages on push to `master`.
