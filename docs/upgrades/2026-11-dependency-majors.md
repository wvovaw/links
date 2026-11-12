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
| 0.5  | Runtime: switch `.nvmrc` to the current Node LTS, rebuild native modules                                      | done        |
| 1    | Patch/minor across the workspace; align `vue-tsc`, `@nuxt/schema`, single TypeScript version                  | done        |
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

## Wave 1 — patches, minors and version alignment

**Status:** done (LINKS-005). Every package below was bumped to its current release, the workspace
drift is gone, and the gate ran green twice in a row on the pinned runtime with a clean tree after
the second run.

Scope note: only the packages named by the ticket were bumped. `valibot`, `@vue/test-utils` and
`vaul-vue` were the only direct dependencies still showing a patch/minor behind and were **not**
named in the wave, so they are deferred rather than smuggled in — see "Left behind" below.

### `nuxt`, `@nuxt/schema`, `@nuxt/content`, `@nuxt/image`, `@nuxt/test-utils`

```text
package            nuxt 4.5.2 → 4.6.4 (web, ui)
                   @nuxt/schema 4.5.0 → 4.6.4 (was pinned exact and had drifted from nuxt)
                   @nuxt/content 3.15.2 → 3.16.2
                   @nuxt/image 2.1.0 → 2.2.1
                   @nuxt/test-utils 4.1.0 → 4.4.0
guide read         https://github.com/nuxt/nuxt/releases/tag/v4.6.4 (security release, Nuxt CLI v4),
                   https://github.com/nuxt/content/releases/tag/v3.16.0,
                   https://github.com/nuxt/image/releases/tag/v2.2.0 (ipx v4),
                   https://github.com/nuxt/test-utils/releases/tag/v4.4.0
changed            version ranges only. 4.6 is the security release, so it is the reason the nuxt
                   minor was not deferred. @nuxt/schema is pinned exact again but at the version
                   nuxt resolves; it must be moved together with nuxt from now on.
deferred           the `unctx`/`oxc-parser` and `unplugin` peer warnings that arrive through
                   Nuxt's module chain (see "Peer warnings")
verified           clean install, pnpm build, pnpm verify; web build and the 61-test Nuxt suite
```

### `vue`, `vue-router`, `pinia`, `@pinia/nuxt`

```text
package            vue 3.5.41 → 3.5.45
                   vue-router 5.2.0 → 5.5.0
                   pinia 4.0.3 → 4.1.0 (web declared the bare range "4", now ^4.1.0)
                   @pinia/nuxt 1.0.2 → 1.0.3
guide read         https://github.com/vuejs/router/releases/tag/v5.5.0 (v5.4.0's breaking change is
                   flagged experimental — normalized query arrays — and this app uses no
                   experimental router features), https://github.com/vuejs/pinia/releases/tag/v4.1.0,
                   https://github.com/vuejs/core/blob/main/CHANGELOG.md
changed            version ranges only, no API changes used here. The pinia bump also cleared the
                   `@pinia/nuxt` peer warning that appeared mid-upgrade.
deferred           `@pinia/testing` stays on its old major — wave 3
verified           pnpm build + web tests
```

### `unocss` and `@unocss/*`

```text
package            unocss, @unocss/nuxt, @unocss/reset, @unocss/extractor-mdc,
                   @unocss/transformer-directives 66.7.5 → 66.12.0
guide read         https://github.com/unocss/unocss/releases/tag/v66.12.0
changed            version ranges only; the preset/transformer wiring in the ui preset and the two
                   nuxt configs is unchanged
deferred           the `@unocss/rollup` → `rollup` 4 peer warning is unbuild's old rollup 3 copy —
                   wave 3 (unbuild/mkdist)
verified           pnpm build (both nuxt builds compile the preset), web tests
```

### `@iconify-json/*`

```text
package            @iconify-json/lucide 1.2.123 → 1.2.154
                   @iconify-json/vscode-icons 1.2.72 → 1.2.98
guide read         none — generated icon data, no changelog; https://github.com/iconify/icon-sets
changed            version ranges only
deferred           nothing
verified           pnpm build, web tests
```

### `better-sqlite3`

```text
package            13.0.3 → 13.1.1 (backend dependency, web devDependency)
guide read         https://github.com/WiseLibs/better-sqlite3/releases/tag/v13.1.1 (SQLite 3.54.1;
                   13.1.0 was withdrawn upstream, 13.1.1 is the first viable release)
changed            version range only; still N-API based, so the prebuilt binary works on the pinned
                   runtime without a source build
deferred           typeorm's peer range still tops out at better-sqlite3 12 — wave 5 (TypeORM)
verified           loaded under the pinned runtime against an in-memory database (insert + select),
                   then booted the backend against a deleted data.sqlite: the baseline migration was
                   applied and the schema came back complete
```

### `vue-tsc` and `@vue/typescript-plugin`

```text
package            vue-tsc 2.2.12 → 3.3.14 (ui, was a major behind) and 3.3.9 → 3.3.14 (web)
                   @vue/typescript-plugin 2.2.12 → 3.3.14
guide read         https://github.com/vuejs/language-tools/releases/tag/v3.3.14
changed            alignment only — one major everywhere. Type checking is not part of the gate and
                   the pre-existing errors on apps/web and packages/ui are unchanged by the move.
deferred           the new `mkdist` → `vue-tsc` peer warning, and the UI build's TS2742 on the toast
                   composable — wave 3 (unbuild/mkdist), see "Peer warnings"
verified           `vue-tsc --noEmit` in both packages still reports the same classes of pre-existing
                   errors as the baseline, and the gate is unaffected
```

### `typescript`

```text
package            5.4.5 (backend, ui), 5.9.3 (web), 7.0.2 (blocks) → 5.9.3 everywhere
guide read         https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/ — no
                   migration steps needed for this codebase
changed            one workspace-declared version. Blocks was moved *back* from the next major on
                   purpose: TypeScript's next major is wave 5, and tsdown is happier on the shared
                   version. Only remaining copy is 5.7.2 nested under @nestjs/cli's
                   fork-ts-checker-webpack-plugin, i.e. tooling-internal and not a workspace choice.
deferred           TypeScript's next major — wave 5
verified           pnpm build (all four packages, tsdown included), pnpm verify
```

### `tsdown`, `oxlint`, `oxfmt`

```text
package            tsdown 0.22.14 → 0.23.7
                   oxlint 1.78.0 → 1.93.0 (declared ranges moved from ^1.59.0)
                   oxfmt 0.44.0 → 0.78.0
guide read         https://github.com/rolldown/tsdown/releases/tag/v0.23.7 (rolldown-plugin-dts 0.30;
                   v0.23.3 keeps TypeScript 7 support), https://github.com/oxc-project/oxc/releases/tag/oxlint_v1.93.0,
                   https://github.com/oxc-project/oxc/releases/tag/oxfmt_v0.78.0
changed            version ranges only; no config or script edits were needed. oxfmt's formatter
                   output changed, so the reformat landed as its own commit
                   (`style: reformat with the current oxfmt`): import order in one constructor
                   toolbar component, a wrapped inline-code span in docs/agents/conventions.md, and
                   six markdown files under packages/ui/docs. No semantic change.
deferred           the new `nuxt` → `rolldown` peer warning caused by tsdown's rolldown line, see
                   "Peer warnings"
verified           pnpm lint (warnings only, no new failures), pnpm fmt, pnpm build, pnpm verify
```

### Peer warnings left after wave 1

Re-checked by forcing a fresh resolution. Of the three baseline warnings, the `@nuxt/content` →
`better-sqlite3` one is gone (the content bump cleared it) and the other two are explained below.
Two new warnings came from in-scope bumps:

```text
typeorm → better-sqlite3 13.x      pre-existing; typeorm's peer range stops at 12 — wave 5
@vitejs/plugin-vue → vite 8        pre-existing — wave 4
unctx → oxc-parser / unplugin      pre-existing; arrives through @nuxt/kit inside
                                   nuxt-component-meta and @vueuse/nuxt, so no direct bump fixes
                                   it — follow the Nuxt/kit chain, i.e. the framework wave
@unocss/rollup → rollup 4          pre-existing; unbuild still brings rollup 3 — wave 3
mkdist → vue-tsc 3                 new in wave 1: caused by the vue-tsc alignment. mkdist is
                                   out of scope here — wave 3 (unbuild/mkdist)
nuxt → rolldown ~1.2.1             new in wave 1: tsdown 0.23 ships rolldown ~1.3, so the two
                                   build tools disagree. Both are build-time only and never loaded
                                   in the same process, and the gate is green. No current wave
                                   ticket names tsdown/rolldown, so wave 4 (tooling) should pick
                                   it up; revisit when Nuxt widens the peer or tsdown moves back
                                   in line.
```

### Left behind deliberately

Direct dependencies that `pnpm outdated -r` still lists, and why they are not wave 1:

```text
valibot                   1.4.2 → 1.5.0        not named in the wave — wave 3 when the
                                                 validation stack is revisited
@vue/test-utils           2.4.11 → 2.5.1       not named; 2.5.0 drops class-component
                                                 support, so it belongs with the frontend
                                                 test-stack wave (wave 3)
vaul-vue                  0.1.3 → 0.4.1        pre-1.0 minor, i.e. potentially breaking;
                                                 not named — frontend majors (wave 3)
```

The rest of the outdated list is the out-of-scope set the ticket names (NestJS, TypeORM, `multer`,
`argon2`, `class-validator`, `@commitlint/*`, `taze`, `@types/node`, `@vitejs/plugin-vue`,
`@vue/tsconfig`, `vitest`/`@vitest/ui`, `happy-dom`, `@pinia/testing`, `@vueuse/*`,
`@formkit/drag-and-drop`, `unbuild`/`mkdist`, `radix-vue`, TypeScript's next major). The
`@types/express` and `@types/multer` majors are left too: they are not patch/minor bumps and they
travel with the NestJS and multer waves.
