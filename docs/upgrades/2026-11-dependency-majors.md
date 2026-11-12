# Campaign: dependency majors

**Started:** 2026-11-12
**Goal:** move every workspace dependency to its current release, including majors, with each major
verified against its official migration guide, and end with a repo that installs, builds, tests and
runs.

**Driving context:** the repo sat idle long enough that the majors stacked up. Order matters: gates
first, so every later wave is judged by the same standard.

## Waves

| Wave | Scope                                                                                                         | Status      |
| ---- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| 0    | Gates: CI, read-only lint/format scripts, formatting pass, in-repo tracker                                    | done        |
| 0.5  | Runtime: switch `.nvmrc` to the current Node LTS, rebuild native modules                                      | not started |
| 1    | Patch/minor across the workspace; align `vue-tsc`, `@nuxt/schema`, single TypeScript version                  | not started |
| 2    | Backend security majors: `multer`, `argon2`, `class-validator`                                                | not started |
| 3    | Frontend majors: `vitest`, `@vueuse/*`, `@formkit/drag-and-drop`, `unbuild`/`mkdist`, `radix-vue` → `reka-ui` | not started |
| 4    | Tooling: `commitlint`, `taze`, `@types/node`, `@vitejs/plugin-vue`, `@vue/tsconfig`, `oxlint`/`oxfmt`         | not started |
| 5    | Framework majors: TypeScript → 7 path, NestJS, TypeORM                                                        | not started |

Wave tickets are created when the wave starts, one per ticket in `docs/tickets/`.

## Baseline observations (before the campaign)

Recorded while setting up wave 0, so later waves can tell regressions from pre-existing noise:

- `pnpm install` reports unmet peers from before the campaign:
  `@nuxt/content` wants an older `better-sqlite3` than the workspace uses; `@vitejs/plugin-vue` is a
  major behind the `vite` that Nuxt resolves; `unctx` wants a newer `oxc-parser`. Wave 1/3/4 must
  clear these.
- Two `multer` copies coexist: the backend declares the old line directly, while
  `@nestjs/platform-express` already pulls the current major. Wave 2 removes the duplicate.
- `vue-tsc` does not pass on `apps/web` or `packages/ui` (pre-existing type errors in Pinia typing,
  `useToast` declarations, and the UI docs site). Part of it is a build defect, not a typing nit:
  the UI library build emits `TS2742` for `useToast.ts` ("inferred type cannot be named without a
  reference to `@vue/shared`"), which leaves `dist/components/Toast/useToast.d.ts` unusable as a
  module and breaks web type checking on an import it can compile fine. Type checking therefore
  cannot join CI yet; it is debt to clear in wave 1/3, not a gate.
- `apps/web` tests pass but the vitest process does not exit on its own; wave 3 (vitest major) is the
  natural place to fix it.
- `packages/blocks` builds through a TypeScript major that is ahead of the rest of the workspace;
  wave 1 aligns TypeScript to a single version.
- `changesets` was removed from the repo: every package is private and nothing is published, so the
  tool was bookkeeping without a consumer. Package `CHANGELOG.md` files stay as hand-written history.

## Per-package log

Filled in as waves land. One block per package:

```text
package            from → to
guide read         <link>          official migration guide or release notes
changed            config / scripts / imports / API calls
deferred           follow-up ticket, or "nothing"
verified           install, build, tests, manual check
```

### Runtime

```text
node               24.15.0 → 26.13.1 (Lithium)
guide read         https://github.com/nodejs/Release (schedule), nodejs blog entry announcing the LTS transition
changed            .nvmrc pinned to the exact release; engines.node → ^26.0.0; Node 26 ships no corepack,
                   so pnpm (the version in packageManager) is installed globally with npm into that runtime
deferred           @types/node still on the 20 line — wave 4 aligns it with the runtime
verified           clean install, every allowlisted native module loaded, pnpm verify green,
                   backend booted on a deleted database and applied the baseline migration
```

### `@changesets/cli`

```text
package            removed (was 2.31.1)
guide read         not applicable — removal, not an upgrade
changed            .changeset/ directory, root scripts, devDependency
deferred           nothing
verified           pnpm install, pnpm verify
```

Also fixed in wave 0.5, because the gate could not be trusted without it:

```text
gate order         test now runs after build — the web suite imports the UI preset from dist, so a
                   fresh clone failed at test time
cold build         apps/web build runs `nuxt prepare` first; the first build after a clean install
                   could race the generated tsconfig
```
