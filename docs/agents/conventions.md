# Repo conventions and traps

Inherited knowledge that is expensive to rediscover. Versions are deliberately absent — they live in
`.nvmrc`, `package.json` and `pnpm-lock.yaml`.

## Tooling

- **oxlint + oxfmt**, not eslint/prettier. Every package extends the shared `codestyle` package via
  its own `oxlint.config.*` / `oxfmt.config.*` file; scripts pass that file explicitly with
  `--config`.
- `lint` and `fmt` are read-only; `lint:fix` and `fmt:write` are the writing variants. CI runs the
  read-only ones, so a "green local lint" that reformatted files is a false green.
- Recursive root scripts (`pnpm -r <script>`) silently **skip** packages that do not define the
  script. Add the script to a package before wiring it elsewhere.
- `pnpm` does not run dependency install scripts unless the package is allowlisted in
  `onlyBuiltDependencies` in `pnpm-workspace.yaml`. A new dependency that needs a native build must
  be added there, or it installs without its binary.
- There is no root `.npmrc`: dependency resolution is plain pnpm, so packages see only what they
  declare. An undeclared import may work by accident of hoisting and break later.
- Conventional commits are enforced by husky + commitlint on `commit-msg`.
- `apps/web` is the only package with tests (vitest + happy-dom + `@nuxt/test-utils`). Backend has
  none; the API is exercised through the Bruno collection in `apps/backend/.bruno`.
- **A toolchain change can leave a poisoned `node_modules`.** After the hoisting migration, stale
  symlinks from the previous layout survived in the root `node_modules` (a link pointing into a
  `.pnpm` path that no longer existed). Resolution then died at build time with `ENOENT ...
realpath` on a package that looked installed. `find node_modules -maxdepth 2 -xtype l` finds them;
  the fix is `rm -rf node_modules packages/*/node_modules apps/*/node_modules && pnpm install`. CI
  starts from a clean tree, so this class of failure is local-only and easy to misread as a
  regression.

## Workspace packages are consumed via dist

`apps/web` imports `@links/ui` and `@links/blocks` from their built `dist/`. Editing library sources
requires a rebuild before web sees the change:

```bash
pnpm --filter @links/ui lib:build      # unbuild/mkdist
pnpm --filter @links/blocks build      # tsdown
```

`pnpm build` at the root is recursive and runs in dependency order, so it builds both libraries
before web. `prepare` also builds them on `pnpm install`.

## apps/web (Nuxt) — two directories per feature

- Nuxt defaults live in `apps/web/app/`: thin route shells in `app/pages/...` with
  `definePageMeta`/middleware that render page components from the FSD tree.
- Real page components live under `apps/web/src/{pages,features,entities,widgets,shared}`, imported
  through the aliases `~pages`, `~features`, `~entities`, `~widgets`, `~shared` (defined in
  `nuxt.config.ts`).
- Adding a route = a shell in `app/pages/<route>/index.vue` **and** a page component in
  `src/pages/<route>/ui/<name>-page.vue`.
- i18n: locales in `src/shared/locales/en-US.ts` and `ru-RU.ts`; default `en`, strategy
  `prefix_and_default`.
- Web talks to the API through runtime config `public.backendUrl` (env `NUXT_PUBLIC_BACKEND_URL`,
  see `apps/web/.env.example`); uploaded images are resolved against it. `public.baseUrl` builds
  public link URLs.
- Blocks are rendered by resolving a component per block name
  (`src/shared/blocks/use-blocks-resolver.ts`); a block receives `properties` and falls back to
  theme CSS variables for unset values.
- Content (MDC docs) lives in `apps/web/content/`. `packages/ui/docs/` is a separate Nuxt site for
  the UI library.

## apps/backend — data and migrations

- Persistence is TypeORM over **better-sqlite3**, writing `data.sqlite` in `apps/backend`
  (gitignored). Connection options live in `src/database/database.config.ts` and are shared by
  `TypeOrmModule.forRoot` and the CLI data source (`src/data-source.ts`).
- `synchronize: false`: schema changes only through migrations in `src/migrations/`. The app applies
  pending migrations on boot; the CLI data source deliberately does not, so generate/revert stay
  explicit.
- Dev loop, from `apps/backend`: `pnpm migration:generate src/migrations/<Name>` after editing
  entities, then `migration:run` / `migration:revert` / `migration:show`. Generate diffs entities
  against the _current_ database, so run pending migrations first.
- A `data.sqlite` predating migrations has no `migrations` table and collides with the baseline —
  delete the file and let migrations rebuild it.
- Env is read straight from `process.env`, each variable at its point of use with an inline default.

| Variable        | Read in                                                       |
| --------------- | ------------------------------------------------------------- |
| `PORT`          | `main.ts`                                                     |
| `FRONTEND_URL`  | `main.ts` (CORS origin)                                       |
| `DATABASE_PATH` | `database/database.config.ts`                                 |
| `UPLOADS_PATH`  | `storage/local-storage.service.ts`                            |
| `IMAGES_PATH`   | `storage/local-storage.service.ts`                            |
| `JWT_SECRET`    | `auth/auth.tokens.ts` — must be set in production             |
| `NODE_ENV`      | `auth/auth.controller.ts` — gates the `secure` refresh cookie |

- Auth: JWT access tokens plus cookie-based refresh sessions; uploads go through multer into
  `apps/backend/uploads` (gitignored).

## blocks versioning

`packages/blocks/README.md` documents the mandatory backward-compatibility flow: bump
`BLOCK_VERSION` in the factory, add a step to `migrateBlock`, handle the version change in
components. Read it before touching block schemas.

## Ports

Backend and web dev servers, the UI docs site and the blocks watcher all run from `pnpm dev`; the
ports are the ones already configured in each package, and `NUXT_PUBLIC_BACKEND_URL` must agree with
the backend's port.
