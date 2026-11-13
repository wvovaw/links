---
type: ticket
id: LINKS-006
title: "Dependencies wave 2: backend security majors"
status: done
priority: high
area: backend
created: 2026-11-13
updated: 2026-11-13
blocked_by:
  - LINKS-005
blocks:
  - LINKS-008
---

# LINKS-006 — Dependencies wave 2: backend security majors

## What to build

Wave 2 of the dependency campaign: the backend majors that are about correctness and security, not
about new features. Small diff, real blast radius — this wave must be proven against the API, not
only compiled.

In scope:

- `multer` → current major, plus `@types/multer` → its matching major. The backend currently declares
  the old line while `@nestjs/platform-express` already pulls the current one, so the workspace ships
  **two** multer copies; after this wave `pnpm why multer` must show one.
- `argon2` → current major (native module: rebuild and prove it loads).
- `class-validator` → current minor/major line, respecting what `@nestjs/common` supports.

Out of scope: everything in waves 3–5 (see their tickets), `@types/express` and `@nestjs/*` majors
(wave 5), any API shape change.

## Acceptance criteria

- [x] `pnpm why multer` resolves a single version across the workspace
- [x] upload endpoints work end to end against a running backend: avatar upload and block-image
      upload, including a rejected oversized file
- [x] file-size limits are integers: the new multer line rejects non-integer limits, so the
      configured limits and the client must agree
- [x] a password hashed before the `argon2` bump still verifies after it (log in with an existing
      account, not a freshly created one)
- [x] registration, login (JWT + refresh cookie) and link create/read/update/delete pass through the
      Bruno collection in `apps/backend/.bruno`
- [x] `pnpm verify` green on the pinned runtime, working tree clean afterwards
- [x] `docs/upgrades/2026-11-dependency-majors.md` records per package: from → to, the advisory or
      release notes read, what changed here, what was deferred

## Verification

Every command ran on the runtime pinned by `.nvmrc`, i.e. prefixed with
`fnm exec --using="$(cat .nvmrc)" --`. Per-package from → to, the guides read and what is deferred are
in `docs/upgrades/2026-11-dependency-majors.md`; the `@nestjs/platform-express` override for `multer`
lives in `pnpm-workspace.yaml`.

**Install and single multer copy**

```text
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
  → Done, resolution taken from the lockfile; the peer warnings printed while the bump
    re-resolved were the same six recorded at the end of wave 1, none new
pnpm why multer -r
  → Found 1 version of multer, reached through @links/backend and @nestjs/platform-express
    (before: two copies — the line the backend declared and the one platform-express pins)
```

**argon2 hash compatibility (pre-bump hash, post-bump login)**

```text
# step 1 — before touching any version: booted the backend on a deleted data.sqlite with the argon2
#          release the repo shipped before this wave, and ran the collection, which registers
#          newuser@example.com
node -e 'select passwordHash from users'
  → $argon2id$v=19$m=65536,t=3,p=4$1Q1dZAmmW+wilZjVAhFSCQ$5PqRBdq7eDOQv9rHECNBBKVg0MwOeJ+A9+qGHoXGCfI
    createdAt 2026-11-12 20:54:10

# step 2 — after the bump, same data.sqlite, backend rebuilt and restarted
bru run auth/login            → 200, user + refreshToken, access_token cookie set
node -e 'select passwordHash from users'
  → byte-identical to the hash above (the login did not rewrite it)
node -e 'argon2.verify(<that hash>, "securepassword123")'
  → true   (the bumped argon2)
```

`auth/register/register` answers 409 in that run, so the login that proved compatibility used the
pre-existing account, not a freshly created one.

**API smoke — Bruno collection against the running backend**

```text
cd apps/backend/.bruno && bru run . --env local -r      (Bruno CLI, env `local`, backend on :3001)
  → Requests 50 (50 Passed), Tests 98/98, Status PASS
  auth:   register 409 (user exists), register-short-password/-username/-invalid-email 400,
          register-duplicate 409, login 200 (JWT + refresh cookie), login-wrong-password 401,
          login-nonexistent 401, refresh 200 (rotated refresh token, new cookie), refresh-invalid 401,
          session 200, logout 204
  links:  create 201, list 200, get 200, update content/metadata/slug 200, update-slug-duplicate 409,
          delete 204, cascade delete of images 204, slug availability 200
  uploads: upload-avatar 200 (avatarUrl under /storage/avatars/), remove-avatar 200,
          upload-image 201, get-image 200, delete-image 204, unauthenticated upload/delete 401
  public: get-public-link, get-avatar, and the four not-found/not-published cases
```

The collection's public read tolerates a 404 (the link is deleted earlier in the run), so the public
page was read explicitly as well:

```text
create link  → 201 {id, slug "wave2-public-smoke", status FRESH}
patch metadata {"status":"PUBLISHED"} → 200
get /public/links/wave2-public-smoke → 200
  {"title":"Wave 2 public smoke","slug":"wave2-public-smoke","blocks":[],"seo":{},"background":"…"}
delete link → 204
get /public/links/wave2-public-smoke → 404
```

**Upload limits and the oversized case**

The collection has no oversized request, and Bruno's script sandbox cannot create one (`require("node:fs")`
is unavailable), so committing a >5 MiB fixture was the only alternative — not worth it for a repo that
otherwise carries two small JPEGs. The oversized cases were therefore exercised with curl against the
same running backend, authenticated with the access-token cookie from `POST /auth/login`:

```text
curl -X PUT  -F 'avatar=@big-6mb.jpg;type=image/jpeg'      /users/me/avatar
  → 400 {"message":"Avatar must be 5 MB or smaller.","statusCode":400}
curl -X PUT  -F 'avatar=@exactly-5mb.jpg;type=image/jpeg'  /users/me/avatar
  → 200, avatarUrl "/storage/avatars/<uuid>.jpg"          (the limit itself is allowed)
curl -X PUT  -F 'avatar=@over-5mb.jpg;type=image/jpeg'     /users/me/avatar
  → 400 same message                                      (5 MiB + 1 byte)
curl -X POST -F 'file=@big-6mb.jpg;type=image/jpeg'        /storage/images
  → 201 {"fileId":"<uuid>.jpg"}                          (no size limit on this path — see Notes)
```

No `limits` are configured anywhere in the workspace, so the new construction-time validation has
nothing to reject; the only size limit is the integer `5 * 1024 * 1024` in the avatar controller, which
matches the web client's `maxSize(1024 * 1024 * 5)`. Both halves of the new limit rule were checked
directly with a throwaway probe (`.scratch/`, not committed) against the bumped multer:

```text
node .scratch/multer-limit-probe.cjs
  limits.fileSize=1.5      → TypeError: Expected limits.fileSize to be a non-negative integer or Infinity
  limits.fileSize="1024"   → TypeError (same)
  limits.fileSize=-1       → TypeError (same)
  limits.fileSize=1024     → accepted
  512 B  upload with that limit  → 201
  2048 B upload with that limit  → 413 {"multerCode":"LIMIT_FILE_SIZE","multerMessage":"File too large",
                                        "mappedTo":"PayloadTooLargeException"}
```

The 413 matters: Nest maps multer errors by the error message text, and the new multer line moved the
filename out of that message (into `error.filename`), so the mapping still holds for an integer limit.

**Gate**

```text
pnpm build   → all four packages, backend tsc + both library builds + web build
pnpm verify  → tickets:check 9 tickets / 0 warnings, lint, fmt, build, test — exit 0
               web suite: 3 files, 61 tests passed (the pre-existing
               "something prevents the main process from exiting" note is unchanged — wave 3)
git status --short → clean after the gate, on the commit that closed this ticket
```

**Journal**

`docs/upgrades/2026-11-dependency-majors.md` carries a wave 2 section: per package from → to, the
release notes and advisories read, what changed in this repo, what is deferred, plus the multer
override rationale, the lockfile note and the peer-warning list.

## Notes

- Work on the runtime pinned in `.nvmrc`; it is not the machine default.
- Native modules must be rebuilt for the pinned ABI; `onlyBuiltDependencies` in `pnpm-workspace.yaml`
  already allows `argon2` and `better-sqlite3`.
- Hash compatibility is the one thing a build cannot prove: verify against a pre-existing hash before
  claiming the argon2 bump is done.
- If the Bruno collection lacks a request for a case in the acceptance criteria, add it there rather
  than testing by hand only. — Superseded for the oversized case: Bruno's script sandbox has no
  `require("node:fs")`, so a generated fixture is impossible and a committed >5 MiB binary was not
  worth it. Those requests are documented under `## Verification` and were run with curl instead.
- `POST /storage/images` has no server-side size limit at all: a 6 MiB upload is accepted and written.
  This predates the wave and is not a multer regression, but it is a gap worth its own ticket — adding
  a limit changes API behaviour, which wave 2 was not allowed to do.
