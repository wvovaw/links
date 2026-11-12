---
type: ticket
id: LINKS-010
title: "Resolve the @links/ui components.d.ts packaging entry"
status: backlog
priority: low
area: ui
created: 2026-11-13
updated: 2026-11-13
blocked_by: []
blocks: []
---

# LINKS-010 — Resolve the `@links/ui` `components.d.ts` packaging entry

## What to build

`packages/ui/package.json#files` lists `components.d.ts`, but no build produces it and no file with
that name has ever been tracked in git. Either generate a real declaration file as part of
`lib:build`, or remove the entry so the package metadata matches what is actually shipped.

If the file is generated it must describe the library's exported components deterministically; a
placeholder file is worse than no file. If it is removed, update any documentation that implies it
exists.

## Acceptance criteria

- [ ] `pnpm --filter @links/ui lib:build` either produces a deterministic `components.d.ts`, or
      `components.d.ts` is gone from `files`
- [ ] the package public contract is documented and `pnpm build` stays green
- [ ] `pnpm verify` green

## Notes

Found while verifying LINKS-007: the unbuild/mkdist major preserved the real exports
(`dist/index.*`, `dist/preset/*`, `dist/css/theme.css`, per-component declarations), but the
`components.d.ts` entry was already stale before the wave. This is a packaging-metadata gap, not a
wave 3 regression.
