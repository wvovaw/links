# AGENTS.md

pnpm 10 monorepo (`pnpm-workspace.yaml`). Node 24 (`.nvmrc`; root `package.json` sets `engines` to `node: ^24.0.0`, `pnpm: ^10.0.0`). There is no root `.npmrc` — dependency resolution is plain pnpm, so packages only see what they declare. Branch: `master`.

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
- **pnpm 10 runs no dependency install scripts unless allowlisted.** Native packages are opted in via `onlyBuiltDependencies` in `pnpm-workspace.yaml` (`argon2`, `better-sqlite3`, `esbuild`, `sharp`, …); a new dependency needing a native build must be added there, or it installs without its binary.
- `pnpm dev` — parallel dev: backend watch (3001), web (3000), ui docs (3002), blocks `tsdown -w`.
- `pnpm build` / `pnpm lint` / `pnpm fmt` / `pnpm test` — run recursively; target one package with `pnpm --filter <name> …`.
- Recursive scripts silently skip packages that don't define them — notably `@links/ui`, whose library build is `lib:build`, so root `pnpm build` does **not** build it. `packages/codestyle` defines no scripts at all.
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

## apps/backend (NestJS) — database & migrations

- Persistence is TypeORM + **better-sqlite3** (native driver) writing to `data.sqlite` in `apps/backend` (gitignored).
- Connection options live in `src/database/database.config.ts` and are shared by `TypeOrmModule.forRoot` and the CLI data source (`src/data-source.ts`).
- `synchronize: false` — **schema changes only through migrations** in `src/migrations/`. The app applies pending ones on boot (`migrationsRun: true`, set in `app.module.ts`); the CLI data source deliberately does not, so generate/revert stay explicit.
- Dev workflow (from `apps/backend`): `pnpm migration:generate src/migrations/<Name>` after editing entities, then `pnpm migration:run` / `pnpm migration:revert` / `pnpm migration:show`. Generate diffs entities against the *current* `data.sqlite`, so run pending migrations first.
- A `data.sqlite` predating migrations (built by the old `synchronize`, so it has no `migrations` table) collides with the baseline — delete the file and let migrations rebuild it.
- Env is read straight from `process.env` (no dotenv/ConfigModule), each at its point of use with an inline default:

| Var | Default | Read in |
|---|---|---|
| `PORT` | `3001` | `main.ts` |
| `FRONTEND_URL` | `http://localhost:3000` | `main.ts` (CORS origin) |
| `DATABASE_PATH` | `data.sqlite` | `database/database.config.ts` |
| `UPLOADS_PATH` | `uploads/avatars` | `storage/local-storage.service.ts` |
| `IMAGES_PATH` | `uploads/images` | `storage/local-storage.service.ts` |
| `JWT_SECRET` | a dev-only literal — **must** be set in production | `auth/auth.tokens.ts` |
| `NODE_ENV` | — gates the `secure` refresh-cookie flag | `auth/auth.controller.ts` |

- Auth: JWT access tokens + cookie-based refresh sessions; file uploads via multer into `apps/backend/uploads` (gitignored).
- API collections for Bruno live in `apps/backend/.bruno`.

## blocks versioning (read before touching)

`packages/blocks/README.md` documents a mandatory backward-compat migration flow: bump `BLOCK_VERSION` in the factory, add a step to `migrateBlock`, and handle the version change in components. Read it before changing block schemas.

## Testing

- Only `apps/web` has tests (vitest, happy-dom, `@nuxt/test-utils`); run with `pnpm --filter @links/web test` or single file via `vitest run <path>`. No backend tests exist.

## Commits & CI

- Conventional commits enforced by husky + commitlint (`commit-msg` hook). Changesets for versioning (`pnpm changeset`, base branch `master`).
- `.github/workflows/ui.deploy.yml` builds the repo and deploys `packages/ui` docs to GitHub Pages on push to `master`.
