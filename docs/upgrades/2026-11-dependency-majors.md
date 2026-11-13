# Campaign: dependency majors

**Started:** 2026-11-12
**Goal:** move every workspace dependency to its current release, including majors, with each major
verified against its official migration guide, and end with a repo that installs, builds, tests and
runs.

**Driving context:** the repo sat idle long enough that the majors stacked up. Order matters: gates
first, so every later wave is judged by the same standard.

## Waves

| Wave | Scope                                                                                                         | Status |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | Gates: CI, read-only lint/format scripts, formatting pass, in-repo tracker                                    | done   |
| 0.5  | Runtime: switch `.nvmrc` to the current Node LTS, rebuild native modules                                      | done   |
| 1    | Patch/minor across the workspace; align `vue-tsc`, `@nuxt/schema`, single TypeScript version                  | done   |
| 2    | Backend security majors: `multer`, `argon2`, `class-validator`                                                | done   |
| 3    | Frontend majors: `vitest`, `@vueuse/*`, `@formkit/drag-and-drop`, `unbuild`/`mkdist`, `radix-vue` → `reka-ui` | done   |
| 4    | Tooling: `commitlint`, `taze`, `@types/node`, `@vitejs/plugin-vue`, `@vue/tsconfig`, `oxlint`/`oxfmt`         | done   |
| 5    | Framework majors: TypeScript → 7 path, NestJS, TypeORM                                                        | done   |

Wave tickets are created when the wave starts, one per ticket in `docs/tickets/`.

## Outcome

Every wave landed. The workspace now tracks current releases across the board, with three deliberate
exceptions recorded in this file rather than hidden in a range:

- `typescript` resolves to the API-compatible sidecar package, because the current compiler major
  ships without a compiler API and the build tooling still needs one; the compiler itself is the
  current major.
- `pnpm-workspace.yaml` keeps a `multer` override because the framework still pins an exact version;
  the comment there says when to drop it.
- `rolldown` arrives at two minors through Nuxt and the blocks builder. Build-time only, never
  co-loaded, resolved when one of the two moves.

Known debt that the campaign explicitly did not fix, each owned by a ticket or by the notes below:
web/UI type checking is not in the gate; the UI docs app carries its own type errors; the UI library
build still emits `TS2742` for its toast composable; and the API smoke collection needed two runs on a
fresh database (LINKS-012).

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

## Wave 2 — backend security majors

**Status:** done (LINKS-006). Three backend runtime dependencies, moved to their current releases and
proven against a running API rather than only compiled. `@types/multer` travels with `multer`; no
other package version moved in the lockfile.

### `multer` and `@types/multer`

```text
package            multer ^1.4.5-lts.1 → ^2.5.0 (apps/backend)
                   @types/multer ^1.4.11 → ^2.3.0
                   the workspace now resolves one multer: 1.4.5-lts.2 + 2.0.2 → 2.5.0
                   (2.0.2 came in through @nestjs/platform-express, 1.4.5-lts.2 was the declared one)
guide read         https://github.com/expressjs/multer/releases/tag/v2.5.0 — security release,
                   https://github.com/expressjs/multer/security/advisories/GHSA-q7qp-rjg7-q26m
                   (CVE-2026-113872), and the two earlier advisory releases
                   https://github.com/expressjs/multer/releases/tag/v2.4.0
                   (GHSA-3pph-fpjx-jg34 / CVE-2026-88932) and
                   https://github.com/expressjs/multer/releases/tag/v2.3.0 (four more CVEs, among them
                   a crash on a `fileFilter` that calls back twice and a request-level DoS).
                   v2.4.0 is also where non-integer limits start being rejected at construction and
                   where fields at exactly the limit start being accepted:
                   https://github.com/expressjs/multer/pull/1395, /pull/1335, /pull/1407.
changed            version ranges only, plus the workspace override below. No interceptor option and no
                   API call changed: `FileInterceptor("avatar")` and `FileInterceptor("file")` still run
                   multer with its defaults (memory storage, no `limits`).
                   Because 2.4.0 validates `limits` in the `multer()` constructor, a non-integer value
                   would now break app boot instead of silently disabling the limit. Nothing in the
                   workspace passes `limits`, so there is nothing to convert; the only size limit is the
                   avatar controller's integer `5 * 1024 * 1024` check, and the web client's
                   `maxSize(1024 * 1024 * 5)` in `features/user/model/schema.ts` agrees with it exactly.
                   Nest 10's `transformException` maps multer errors by `error.message`, and 2.4.0 moved
                   the filename into `error.filename` instead of the message, so `LIMIT_FILE_SIZE` is
                   still “File too large” and still becomes a 413 — checked at runtime, not assumed.
deferred           `POST /storage/images` (block images) has no server-side size limit at all: a 6 MiB
                   file is accepted and written. That is pre-existing, not a wave-2 regression, and
                   adding a limit changes API behaviour, so it needs its own ticket rather than a
                   smuggled change here. The 3.0 alphas are not taken — the campaign tracks current
                   stable majors.
verified           pnpm why multer -r → “Found 1 version of multer”; backend boots on the pinned
                   runtime against an existing data.sqlite; the Bruno collection passes 50/50 requests,
                   98/98 tests; oversized uploads exercised with curl (6 MiB avatar → 400, 5 MiB exactly
                   → 200, 5 MiB + 1 byte → 400, 6 MiB block image → 201); a throwaway probe with
                   `limits.fileSize = 1.5` throws `TypeError: Expected limits.fileSize to be a
                   non-negative integer or Infinity`, and with `limits.fileSize = 1024` a 2048-byte
                   upload comes back 413 `PayloadTooLargeException`.
```

### Workspace override for `multer`

```text
package            pnpm-workspace.yaml → `overrides: { multer: ^2.5.0 }`
                   @nestjs/platform-express 10.4.22 pins `multer: 2.0.2` (exact, Nest pins its runtime
                   deps exactly by policy), so declaring the current release in the backend alone left
                   two copies — and `FileInterceptor` loads the nested one, i.e. the unpatched code.
                   The override makes the pinned copy resolve to the workspace's 2.x line, which is what
                   makes `pnpm why multer` show one version *and* makes the upload endpoints actually run
                   the patched release. Multer 2.5.0 only adds API on top of 2.0.2, and the upload paths
                   are exercised end to end above.
deferred           removing the override — wave 5 (NestJS), when platform-express starts pinning a line
                   that is current on its own. Keeping it past that wave would silently hold Nest's own
                   dependency back, so the comment in pnpm-workspace.yaml says to drop it then.
verified           pnpm install, pnpm why multer -r, the upload requests in the Bruno collection
```

### `argon2`

```text
package            argon2 ^0.40.3 → ^0.45.2 (native module, still allowed in onlyBuiltDependencies)
guide read         https://github.com/ranisalt/node-argon2/releases/tag/v0.45.2 — “Fix Argon2 PHC
                   parameter order” (https://github.com/ranisalt/node-argon2/pull/562): `hash()` used to
                   serialize parameters as `m,p,t`, the PHC spec wants `m,t,p`. The parser accepts both
                   orders and the digest is unchanged, so existing hashes keep verifying;
                   https://github.com/ranisalt/node-argon2/releases/tag/v0.45.0 drops Node 18 and 20
                   support (the workspace runtime is past both, see .nvmrc), v0.45.1 fixes the generated
                   types for `hash()`.
changed            version range only. The package still ships CommonJS, and the backend's `tsc` build
                   imports it as `import * as argon2` — unchanged. Hash output is back on the canonical
                   `m,t,p` order: the pre-bump hash in the test database already read
                   `$argon2id$v=19$m=65536,t=3,p=4$…`, and hashes written after the bump are identical in
                   shape.
deferred           nothing
verified           a user registered *before* the bump (password hashed by 0.40.3) logs in through the
                   API after it — same row, byte-identical `passwordHash`, 200 plus a JWT and a refresh
                   token; `argon2.verify()` returns true for that hash in a direct module call; the full
                   collection then exercises refresh, logout and the argon2-hashed refresh sessions.
```

### `class-validator`

```text
package            class-validator ^0.14.1 → ^0.15.1
guide read         https://github.com/typestack/class-validator/releases/tag/v0.15.0 — the one flagged
                   breaking change is `IsIBAN`, which now takes an `IsIBANOptions` argument; the rest is
                   additive (`@IsISO31661Numeric`, `isISO6391`, `validateIf` in validation options, UUID
                   versions 1-8). https://github.com/typestack/class-validator/releases/tag/v0.15.1 is a
                   publish fix (0.15.0 was never released as `latest`).
changed            version range only. `@nestjs/common` declares class-validator as an optional `*` peer,
                   so the `ValidationPipe` in `main.ts` keeps working unchanged; the DTOs use only
                   IsEmail/IsString/MinLength/MaxLength/Matches/IsOptional/IsArray/IsObject/IsEnum, none
                   of which changed.
deferred           adding `forbidUnknownValues` cleanup or moving DTO validation to another library is not
                   in scope; the validation stack (`valibot` on the web side) is revisited in wave 3.
verified           the collection's 400 responses (short password, short username, invalid email, short
                   link title, short slug, unknown/extra fields) keep their status codes and messages.
```

### Lockfile note

Aside from the four packages above and their transitives (`cross-env` and `@epic-web/invariant` arrive
with argon2, `concat-stream`/`mkdirp`/`typedarray`/`xtend` leave with multer 1.x), the lockfile diff
is peer-variant re-keying: the same versions re-keyed under `class-validator@0.15.1` suffixes and a
handful of rollup/oxc-parser variants collapsing to one. No other package version moved, and
`pnpm why` for anything outside wave 2 is unchanged. Re-checked after a clean install.

### Peer warnings after wave 2

Same six as the end of wave 1, none new: `typeorm` → `better-sqlite3` 13 (wave 5), `nuxt` →
`rolldown` and the `unctx` → `oxc-parser`/`unplugin` chain (framework wave), `@unocss/rollup` →
`rollup` 4 and `mkdist` → `vue-tsc` 3 (wave 3), `@vitejs/plugin-vue` → `vite` (wave 4).

### Left behind deliberately

```text
@types/express     4.17.x → 5.x     not named — travels with the NestJS wave (wave 5)
multer 3.x alphas  —                prerelease, not a current stable major
```

Wave 2 closes without touching NestJS, TypeORM, TypeScript or anything in waves 3-5.

## Wave 3 — frontend majors

**Status:** done (LINKS-007). The wave that leaves the abandoned primitives library. The gate ran
green on the pinned runtime; the web suite now exits on its own, and the radix → reka sweep leaves no
`radix-vue` entry in a manifest, an import, a style, or the lockfile.

Scope note: only the packages named by the ticket were moved. `@formkit/drag-and-drop` needed a
call-site rewrite, the primitives migration touched every component that imports a primitive, and
the vitest major exposed the test-process hang. Type-check debt outside those paths was left alone
unless the change made it free to fix.

### test stack: `vitest`, `@vitest/ui`, `happy-dom`, `@pinia/testing`, `@vue/test-utils`

```text
package            vitest 4.1.10 → 5.1.0
                   @vitest/ui 4.1.10 → 5.1.0
                   happy-dom 20.0.11 → 21.0.4
                   @pinia/testing 0.1.3 → 2.0.2
                   @vue/test-utils 2.4.5 → 2.5.1
guide read         https://github.com/vitest-dev/vitest/releases/tag/v5.0.0,
                   https://github.com/capricorn86/happy-dom/releases/tag/v21.0.0,
                   https://github.com/vuejs/pinia/releases/tag/%40pinia%2Ftesting%402.0.0,
                   https://github.com/vuejs/test-utils/releases/tag/v2.5.0
changed            version ranges; `vite` is a peer of the vitest major and already resolves to the
                   workspace Vite. `@vue/test-utils` 2.5 drops class-component support — this app
                   only uses `<script setup>`, so no call sites moved. The suite ran 61 tests before
                   and after the bump.
deferred           the new `vitest` → `@types/node` peer warning (the workspace still has the wave 4
                   `@types/node` line)
verified           `pnpm --filter @links/web test`: 4 files, 62 tests, exits with code 0 and no
                   "close timed out" message. See the hang entry below for what caused it.
```

### The test-process hang

```text
symptom            vitest 4 printed "close timed out after 10000ms"; vitest 5 printed it and named
                   two Vite servers. The process exited only because Vitest forces it.
cause              `defineVitestConfig` with a non-nuxt `environment` splits the config into two
                   Vitest projects — a `nuxt` project (include: only `*.nuxt.test`) and the
                   happy-dom project. Both start a Vite server; the unused nuxt project never
                   finished closing, and the process also held HTTP handles from the UnoCSS
                   web-fonts fetch.
changed            `apps/web/vitest.config.ts` now uses `defineVitestProject` instead of
                   `defineVitestConfig`. The Nuxt Vite config (aliases, auto-imports, components) is
                   still applied, but the config no longer creates the unused nuxt project, so
                   there is one Vite server and it closes.
deferred           nothing — the hang is fixed, not tolerated.
verified           `pnpm --filter @links/web test` exits on its own; the same command with
                   `--reporter=hanging-process` no longer reports live handles.
```

### `@vueuse/*`

```text
package            @vueuse/core 11.0.0 → 15.0.0 (ui)
                   @vueuse/nuxt 14.3.0 → 15.0.0 (web, ui)
                   @vueuse/core added directly to web (it imports it; only the Nuxt module used to
                   bring it in, and that stopped resolving with the new module)
guide read         https://github.com/vueuse/vueuse/releases/tag/v15.0.0
changed            version ranges plus the explicit core dependency. The composables actually used
                   are `useColorMode`, `useCycleList`, `useVModel`, `useElementHover`, `useDropZone`,
                   `useMediaQuery`, `useDebouncedRefHistory`, `useToggle` and `useMemoize`; none
                   needed a call-site change.
deferred           the transitive `unctx`/`oxc-parser`/`unplugin` peer warnings still arrive through
                   Nuxt's module chain — framework wave
verified           builds for web and the UI library, the web suite, and a constructor page loaded in
                   the browser
```

### `@formkit/drag-and-drop`

```text
package            0.0.38 → 0.7.0
guide read         https://github.com/formkit/drag-and-drop/releases/tag/v0.7.0 and the current
                   vue/type surface in the installed package
changed            `page-renderer.vue` rewritten against the current API. The current core still
                   takes `parent/getValues/setValues`, but it now also exposes `onDragstart` /
                   `onDragend`, so the integration pauses the constructor history for the duration
                   of a drag and commits once on drag end. `setValues` ignores an array with the
                   same block ids, so a drop on the same index does not create a history entry.
                   The handler is torn down with `tearDown` when the renderer unmounts.
deferred           nothing
verified           a real Chromium drag moved `block-par1` behind `block-btn1`; undo restored the
                   old order, redo re-applied the new one. A store test covers the same invariants:
                   same-order update adds no undo entry, one reorder adds exactly one, undo/redo
                   round-trips (`constructor.store.test.ts`).
```

### `unbuild` and `mkdist`

```text
package            unbuild 2.0.0 → 3.6.1
                   mkdist 1.4.0 → 2.4.1
guide read         https://github.com/unjs/unbuild/releases/tag/v3.0.0,
                   https://github.com/unjs/mkdist/releases/tag/v2.0.0
changed            `build.config.ts` only needed the primitives external renamed. The existing
                   mkdist entry layout survives: `dist/index.*`, `dist/preset/*`, `dist/css/theme.css`
                   and every per-component declaration are produced. The TS2742 on `useToast` that
                   used to be a warning is now a build failure; it was fixed by giving `useToast` and
                   `toast` explicit return types and by describing the toast payload without the full
                   reka `ToastProps` type. The `mkdist → vue-tsc` peer warning from wave 1 is gone.
deferred           nothing
verified           `pnpm --filter @links/ui lib:build` exits 0 with no warnings; a consuming
                   `pnpm build` passes; from `apps/web`, `import.meta.resolve` finds
                   `@links/ui`, `@links/ui/preset` and `@links/ui/theme.css` under
                   `packages/ui/dist`.
```

`components.d.ts` is listed in `packages/ui/package.json#files`, but neither the old nor the new
toolchain produces it — `lib:build` never did, and no file is tracked in git history. The build
contract that does exist (the exports above plus `dist/components/**/*.d.ts`) is intact. This is a
packaging entry that has been stale since the monorepo move, not a wave 3 regression; it is recorded
here rather than silently "restored" by inventing a declaration file. LINKS-011 owns the decision
(generate it or drop it from `files`).

### `radix-vue` → `reka-ui`

```text
package            radix-vue 1.7.1 → reka-ui 2.11.0 (web, ui devDependencies)
                   peer radix-vue 1.5.2 → reka-ui 2.11.0 (ui)
guide read         https://reka-ui.com/docs/guides/migration
changed            every primitive import and re-export in `packages/ui/src/lib` and `apps/web`;
                   the UI library's `build.config.ts` external; the component docs and README links.
                   Naming-convention changes: `--radix-*` → `--reka-*` in the UnoCSS preset
                   animations and the Toast/RichSelect classes. No `data-radix-*` selector existed in
                   the tree; the sweep checked `data-radix`, `data-reka` and `--radix-` across the
                   whole tracked tree. The Nuxt module was not used (`radix-vue/nuxt` never appeared
                   in either `nuxt.config.ts`), so there was no module specifier to move.
                   Component API changes used by this library: Checkbox/Toggle/Switch controlled state
                   is now `v-model` / `modelValue` instead of `checked` / `pressed`; DropdownMenu
                   CheckboxItem uses `v-model`; Pagination already passed `itemsPerPage`. The
                   wrappers and the affected web/docs call sites were moved accordingly.
deferred           no visual or behavioural follow-up found. The dark/light theme was checked in the
                   constructor and on a public page after the prefix change.
verified           `git grep radix-vue` (outside the ticket and this journal) is empty; `radix` also
                   only matches the unrelated `radix3` package in the lockfile. Built CSS contains
                   only `--reka-*` variables. Chromium screenshots of the constructor and a public
                   page show both themes rendering.
```

### `valibot`, `vaul-vue`

```text
package            valibot 1.0.0 → 1.5.0 (web, ui)
                   vaul-vue 0.1.0 → 0.4.1 (web, ui; peer range follows)
guide read         https://github.com/fabian-hiller/valibot/releases/tag/v1.5.0,
                   https://github.com/unovue/vaul-vue/releases
changed            version ranges only; the validation calls used here (`object`, `pipe`, `string`,
                   `minLength`, `maxLength`, `regex`, `email`, `check`, `forward`) are unchanged,
                   and the Drawer wrapper keeps compiling against the new vaul-vue root/content API.
deferred           nothing
verified           builds and the web suite; the drawer is part of the built UI library
```

### Type checking after wave 3

```text
apps/web           `vue-tsc --noEmit` now passes. The wave fixed the useToast call in the create-link
                   form, the `@vueuse/core` import resolution, the RichSelect locale handler type,
                   the SEO description narrowing, and one possibly-undefined test access.
packages/ui         `vue-tsc --noEmit` reports only the pre-existing docs-app errors (`~ui/*`
                   aliases, auto-imports and content types are only generated by the docs Nuxt
                   build). The library sources and the generated `dist` declarations are clean,
                   including the toast declaration that used to break consumers.
```

### Peer warnings after wave 3

```text
typeorm → better-sqlite3 13.x      pre-existing — wave 5
@vitejs/plugin-vue → vite 8        pre-existing — wave 4
unctx → oxc-parser / unplugin      pre-existing; arrives through the Nuxt module chain — framework
vitest → @types/node               new in wave 3: vitest wants a newer `@types/node` than the
                                   workspace has; that package is explicitly wave 4
nuxt → rolldown ~1.2.1             pre-existing from wave 1 (tsdown's rolldown line) — wave 4
mkdist → vue-tsc 3                 cleared in wave 3: mkdist 2 does not carry the old peer
@unocss/rollup → rollup 4          cleared in wave 3: unbuild 3 brought one rollup 4 line
```

## Wave 4 — tooling majors

**Status:** done (LINKS-008). The repository tooling and the type packages that had to catch up with
the runtime. No source file changed: every package moved on its own, the one script that had to be
rewritten is `upg`, and the gate ran green on the pinned runtime with a clean tree.

Scope note: `oxlint`/`oxfmt` are named in the wave table but were already current after wave 1
(`pnpm outdated -r` listed neither), so this wave moved the five packages the ticket names.

### `@commitlint/cli` and `@commitlint/config-conventional`

```text
package            19.8.1 → 21.2.4 (root)
guide read         https://github.com/conventional-changelog/commitlint/releases/tag/v20.0.0,
                   https://github.com/conventional-changelog/commitlint/releases/tag/v21.0.0
changed            version ranges only. `commitlint.config.mjs` still extends
                   `@commitlint/config-conventional` and `.husky/commit-msg` still runs
                   `npx --no -- commitlint --edit`. What the majors changed is inside the tool:
                   20.0.0 makes `body-max-line-length` ignore lines that contain a URL, and 21.0.0
                   raises the runtime floor to the Node 22 line (satisfied by .nvmrc) and prints
                   the offending input on its own line (`--legacy-output` keeps the old
                   rendering). Nothing here parses commitlint output, so neither is a code change.
deferred           nothing
verified           the hook both ways. It was inert in this checkout — husky's shim directory
                   (`.husky/_`) was absent and `core.hooksPath` unset, because the machine's
                   `~/.npmrc` sets `ignore-scripts=true`, so `pnpm install` never ran the root
                   `prepare`. After `pnpm exec husky` wired it, `git commit --allow-empty -m
                   "bad message"` exits 1 with `subject may not be empty [subject-empty]` and
                   `type may not be empty [type-empty]`, while `git commit --allow-empty -m
                   "chore: probe the commit-msg hook"` succeeds. Both throwaway commits were
                   removed again.
```

### `taze` and the `upg` script

```text
package            taze 0.13.9 → 21.3.0
guide read         https://github.com/antfu-collective/taze#readme (v21.3.0),
                   https://github.com/antfu-collective/taze/releases/tag/v19.0.0,
                   https://github.com/antfu-collective/taze/releases/tag/v21.0.0
changed            `pnpm upg` rewritten from `taze -r` to
                   `taze -r major --no-node-version --no-github-actions`. `-r` still means
                   "recursive monorepo", but the current CLI grew two surfaces the old one did not
                   have and that this repo owns deliberately: it reads and can rewrite
                   `.nvmrc`/`devEngines.runtime`, and it scans `.github/workflows` for action
                   bumps. The two `--no-…` flags keep `upg` on `package.json` dependencies, and
                   `major` makes the report match the unit of work here — the default (in-range)
                   mode answered "dependencies are already up-to-date in 6 packages" while ten
                   majors were behind. The script still never writes: there is no `-w`.
deferred           workflow action bumps and the `packageManager` suggestion the current CLI also
                   prints; neither is a `package.json` dependency, and both stay manual
verified           `pnpm upg` exits 0 on the pinned runtime, lists the wave 5 majors (`@nestjs/*`,
                   `typeorm`, `typescript`, `@types/express`) plus the in-range patch/minor ones,
                   and writes nothing (`git status` unchanged afterwards).
```

### `@types/node`

```text
package            20.19.43 → 26.6.6 (`apps/backend`, `packages/ui`)
guide read         https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node — no
                   migration guide; the types track the runtime major, and the runtime is the one
                   .nvmrc pins
changed            version ranges only, and the workspace now resolves one copy
                   (`pnpm why @types/node -r` → "Found 1 version"). No type error surfaced and
                   nothing had to be silenced: `pnpm --filter @links/backend build` is clean, and
                   `vue-tsc --noEmit` in `packages/ui` produces byte-identical output before and
                   after the bump (297 errors, all under `docs/` — the docs-app debt recorded in
                   wave 3, untouched by this wave). No `skipLibCheck` was added and no cast was
                   introduced. The `vitest → @types/node` warning left over from wave 3 is gone.
deferred           the compiler-option debt the next TypeScript major turns into errors — wave 5
```

### `@vitejs/plugin-vue`

```text
package            5.2.4 → 6.0.11 (`packages/ui`)
guide read         https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue@6.0.0/packages/plugin-vue/CHANGELOG.md
changed            version range only. 6.0.0's breaking changes are the Node 20.19+/22.12+ floor,
                   the removal of the CJS build and the `include`/`exclude` separation in the
                   plugin API; the package is declared but configured nowhere in this repo, so
                   there is no call site to move. What mattered is the peer range: 6.x accepts
                   `vite ^8`, the line Nuxt resolves here.
deferred           nothing
verified           the `@vitejs/plugin-vue → vite` peer warning is gone from `pnpm install`, and
                   the UI library build plus both Nuxt builds pass
```

### `@vue/tsconfig`

```text
package            0.7.0 → 0.9.1 (`packages/ui`)
guide read         https://github.com/vuejs/tsconfig/releases/tag/v0.8.0,
                   https://github.com/vuejs/tsconfig/releases/tag/v0.9.0
changed            version range only. 0.8.0 turned on `noUncheckedIndexedAccess` in the base
                   config, and 0.9.0 moved that flag to `tsconfig.lib.json` again (this package
                   extends the base), raised `lib` to ES2022 and disabled `libReplacement`. 0.9.x
                   also requires TypeScript >= 5.8, which the workspace satisfies. No new
                   strictness flag reaches `packages/ui` from the bump.
deferred           adopting `noUncheckedIndexedAccess` on purpose is a separate decision, not a
                   side effect of a config package
verified           `pnpm --filter @links/ui lib:build` emits the same dist surface with no
                   warnings, per-component declarations included
```

### Peer warnings after wave 4

```text
typeorm → better-sqlite3 13.x      pre-existing — wave 5
nuxt → rolldown ~1.2.1             unresolved, see below
unctx → oxc-parser / unplugin      pre-existing; arrives through the Nuxt module chain — framework
@vitejs/plugin-vue → vite 8        cleared: 6.x peers `vite ^8`
vitest → @types/node               cleared: the workspace is on the runtime's type major now
```

`nuxt` ↔ `rolldown` cannot be resolved from this package set. nuxt 4.6.4 peers `rolldown ~1.2.1`,
while the workspace resolves rolldown 1.3.2 because tsdown 0.23 — the `packages/blocks` builder —
ships that line. Satisfying Nuxt would mean pinning rolldown back to 1.2, which downgrades
tsdown's own bundler; an override to 1.3 would only hide the mismatch while leaving Nuxt on a
version it does not claim to support. Both are build-time only, never loaded in the same process,
and the gate is green, so the warning is recorded instead of forced. It clears when Nuxt widens
its peer range or tsdown moves back in line; neither package belongs to an open wave ticket, so
whoever touches either one next owns it.

### Left behind deliberately

```text
@nestjs/*          10.x → 12.x    wave 5
@types/express     4.17 → 5.0     wave 5 — must match the Express major Nest actually runs
typescript         5.9 → 7.x      wave 5
typeorm            0.3 → 1.x      wave 5
```

`pnpm outdated -r` after the wave lists exactly those ten entries and nothing else.

## Wave 5 — framework majors

**Status:** done (LINKS-009). The three majors that decide how the backend is compiled, loaded and
persisted. Landed in staged commits: TypeScript, then NestJS through v11 into v12, then TypeORM. The
gate ran green on the pinned runtime, the backend booted on a deleted database, the migration CLI
applied and reverted the baseline, and the Bruno collection passed every request.

### `typescript` — the v7 compiler with the v6 API sidecar

```text
package            5.9.3 → 7.0.2 as the compiler, with @typescript/typescript6 6.0.2 as the
                   `typescript` API package in all four workspace packages
guide read         https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/,
                   https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
changed            all four packages declare the same `typescript` spec, aliased to the documented
                   sidecar: `"typescript": "npm:@typescript/typescript6@^6.0.2"`.
                   apps/backend adds `"@typescript/native": "npm:typescript@^7.0.2"`, so its
                   `tsc -p` build runs the native v7 compiler. That is the only package that
                   invokes a raw `tsc`.
                   apps/backend/tsconfig.json: removed `baseUrl`, replaced `moduleResolution: "node"`
                   with `"bundler"` (allowed with `module: "commonjs"` since v6), and added
                   `rootDir: "./src"` — the new rootDir default would otherwise emit
                   `dist/src/main.js` and break the `start` script.
                   `*.tsbuildinfo` added to apps/backend/.gitignore: the compiler now writes it next
                   to the config instead of inside the ignored `dist`.
deferred           nothing for the compiler. The web type check has two errors left; see
                   "Type checking after wave 5".
verified           `apps/backend/node_modules/.bin/tsc --version` → 7.0.2; backend build emits
                   `dist/main.js` with declarations; `@links/ui` lib:build still emits every
                   per-component declaration through unbuild/mkdist and the sidecar; `@links/blocks`
                   tsdown build emits `dist/main.d.mts`; the TypeORM CLI (ts-node) still starts and
                   reads the data source; `pnpm verify` green.
```

Why not plain `typescript@7` everywhere (the decision, with evidence):

```text
fact               typescript@7.0.2's package entry point is `lib/version.cjs`; the compiler API
                   (`createProgram`, the language service) is not part of 7.0 — 7.1 is expected to
                   ship a new API. Microsoft publishes @typescript/typescript6/tsc6 exactly for
                   tools that import `typescript` at build time.
fact               @links/ui declarations are emitted by unbuild 3.6.1 through rollup-plugin-dts,
                   mkdist and vue-tsc, all of which import the compiler API. unbuild's peer range is
                   still `typescript ^5.9.2`; vue-tsc 3.3.14 has an explicit branch for the
                   `@typescript/typescript6` alias.
fact               the TypeORM CLI runs through `typeorm-ts-node-commonjs`, i.e. ts-node, which
                   also needs the compiler API.
decision           keep one declared `typescript` API package for every workspace package (the
                   sidecar) and add the native v7 compiler only where `tsc` is invoked. This is the
                   documented v7 path and does not leave a broken CLI or a library build without
                   declarations. `pnpm why typescript -r` therefore shows the sidecar for all four
                   packages, the native compiler under apps/backend, and tooling-internal copies
                   nested in Nuxt's component-meta and the Nest CLI (the same class of copy wave 1
                   already accepted).
rejected           stopping at v6: it would leave the campaign on a compiler Microsoft describes as
                   the bridge release while the v7 path works here. Rejected also: rewriting the
                   TypeORM CLI to tsx — the sidecar keeps ts-node working, so no runner change was
                   needed.
```

### NestJS 10 → 12 (through 11)

```text
package            @nestjs/common, @nestjs/core, @nestjs/platform-express 10.3.8 → 12.5.0
                   @nestjs/jwt 10.2.0 → 12.0.4
                   @nestjs/mapped-types 2.0.5 → 12.0.1
                   @nestjs/typeorm 10.0.2 → 12.0.3
                   @nestjs/cli 10.3.2 → 12.0.12
                   @types/express 4.17.21 → 5.0.6 (matches the Express 5 line Nest runs)
guide read         v12: https://docs.nestjs.com/migration-guide
                   v11: https://raw.githubusercontent.com/nestjs/docs.nestjs.com/11.0.0/content/migration.md
changed            the v12 `nest upgrade` schematic only upgrades from v11, so the framework first
                   moved to the v11 line (with Express 5 types) and then to v12.
                   `nest upgrade --dry-run` at v11 reported only:
                     ✔ Updated NestJS packages: @nestjs/common/core/platform-express/cli/jwt/
                       mapped-types/typeorm to ^12.0.0
                     ✔ Scheduled "npm install"
                   — no nest-cli webpack, GraphQL, NATS or @nestjs/config mechanical edits apply to
                   this project. The same version bumps were then applied with pnpm so the workspace
                   lockfile stays authoritative; `nest-cli.json` needs no change.
                   The backend stays CommonJS. Nest 12 packages are ESM-only; Node 26 loads them
                   through require(esm), so `main.ts`, the data source and the compiled layout did
                   not need an ESM rewrite. `main.ts` is unchanged (cookie-parser, ValidationPipe
                   and CORS booted as before).
                   Express 5 route matching: every route uses plain or named parameters, so no
                   wildcard rewrite was needed.
                   No subclass constructors, custom pipes or `@Optional()` inheritance in this app,
                   so the other v12 behaviour changes do not reach it.
deferred           switching the application to ESM is explicitly optional in the v12 guide and is
                   not part of this wave. The `nest upgrade` command's own `npm install` was not
                   run — pnpm owns the lockfile.
verified           the API boots on the pinned runtime against a deleted database and serves a
                   public route; the full Bruno collection passes; `pnpm verify` green.
```

### `multer` override after the Nest wave

```text
package            @nestjs/platform-express 12.5.0 still pins `multer: 2.5.0` exactly, and that is
                   the version the backend declares. The workspace override therefore no longer
                   changes the resolution; there is one copy either way.
decision           keep `overrides.multer: ^2.5.0`, per the wave-2 note's rule for an exact pin, and
                   update the comment to say that the pin now matches the backend's line. Remove it
                   when platform-express widens the pin or moves off this version.
verified           `pnpm why multer -r` → "Found 1 version of multer" (2.5.0, shared by
                   @links/backend and @nestjs/platform-express).
```

### TypeORM 0.3 → 1.1

```text
package            typeorm 0.3.31 → 1.1.3
guide read         https://typeorm.io/docs/releases/1.0/upgrading-from-0.3
changed            the official codemod was run twice, `--dry` first and then for real:
                   `npx @typeorm/codemod v1 src/ --dry` → 31 files processed, 0 transformed,
                   31 skipped, 0 parse errors; the only change it proposed was the dependency bump
                   (`typeorm ^0.3.20 → ^1.0.0`). The real run produced the same result. The range
                   was then raised to the current release, ^1.1.3.
                   No source file needed a hand edit: the backend uses DataSource/Repository APIs
                   only, no removed globals, `findOneById`, `findByIds`, string select/relations,
                   `Connection` or custom repositories.
                   @nestjs/typeorm was already at v12, i.e. above the v11.0.1 floor TypeORM v1
                   requires.
                   The v1 runtime change `invalidWhereValuesBehavior` (null/undefined now throws) was
                   reviewed: every where value in the service layer is a defined id, slug or status,
                   so no option was added to restore the old behaviour.
deferred           typeorm 1.1.3 still peers `better-sqlite3 ^12` while the workspace uses the 13
                   line. This is the pre-existing peer warning recorded since wave 1, not a v1
                   regression; the driver is exercised by the migrations and the whole collection.
verified           `pnpm migration:show`, `migration:run`, `migration:revert` and another
                   `migration:run` all work from the CLI against a deleted `data.sqlite`; the
                   baseline creates users, refresh_sessions, links and block_images and reverts
                   cleanly; `pnpm verify` green.
```

### API and database proof

```text
backend boot       deleted `data.sqlite`; booting `dist/main.js` on the pinned runtime applied the
                   baseline through `migrationsRun` and served `/public/links/:slug` (404 for an
                   unknown slug, i.e. the route is alive)
CLI               `migration:show` on the missing database → baseline pending; `migration:run` →
                   four tables + the migrations row; `migration:revert` → four tables dropped and
                   the row removed; `migration:run` again → re-applied
Bruno              `bru run . --env local -r` → 50/50 requests, 98/98 tests. Registration, login
                   (JWT + refresh cookie), refresh/logout/session, link CRUD, avatar upload/remove,
                   block-image upload/read/delete and the public-page reads all passed.
                   Note: the collection is not self-seeding on a completely empty database — its
                   register test accepts 200/409 but the API answers 201, and two duplicate-slug
                   checks assume a reserved `my-new-link` exists. The first run on the deleted
                   database establishes those fixtures and reports 4 failed tests; the second run
                   is the 50/50 pass above. That ordering assumption predates this wave.
```

### Peer warnings after wave 5

```text
typeorm → better-sqlite3 13.x      pre-existing, unchanged (typeorm's peer still stops at 12)
unbuild → typescript ^5.9.2        new in wave 5: unbuild's declared peer has not caught up with the
                                   sidecar (6.0.2), while its own dependencies (mkdist, vue-tsc,
                                   rollup-plugin-dts) are the ones that accept it and the UI build
                                   emits declarations. Recorded rather than hidden behind a peer
                                   rule: it clears when unbuild widens the range.
nuxt → rolldown ~1.2.1             unresolved pre-existing; see the wave 4 note
unctx → oxc-parser / unplugin      pre-existing; arrives through the Nuxt module chain
```

### Type checking after wave 5

```text
apps/web           `vue-tsc --noEmit` reports two errors in
                   `src/widgets/multilinks-constructor/tests/constructor.store.test.ts` (array
                   destructuring under the Nuxt-generated `noUncheckedIndexedAccess`). Reproduced
                   with TypeScript 5.9.3 before touching the compiler, so it is pre-existing debt
                   exposed by the current Nuxt tsconfig, not a wave 5 regression. Type checking is
                   not part of the gate.
packages/ui        unchanged docs-app debt: `vue-tsc --noEmit` still reports only the pre-existing
                   `~ui/*`/auto-import errors from the docs site.
```

### Left behind deliberately

Nothing. `pnpm outdated -r` exits with no entries after the wave.
