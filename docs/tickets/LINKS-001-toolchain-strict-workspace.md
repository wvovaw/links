---
type: ticket
id: LINKS-001
title: "Toolchain: strict workspace, pinned runtime and package manager"
status: done
priority: high
area: tooling
created: 2026-08-14
updated: 2026-11-12
blocked_by: []
blocks:
  - LINKS-002
  - LINKS-003
---

# LINKS-001 — Toolchain: strict workspace, pinned runtime and package manager

## What to build

The monorepo installs, builds, lints and tests on a pinned Node LTS with a pinned package manager and
a strict, isolated `node_modules` — no hoisting. Native modules build through an explicit allowlist
instead of an interactive approve step. Packages that silently relied on hoisted transitive
dependencies get them declared.

Scope: pin the runtime everywhere it is read (`engines`, `.nvmrc`, CI), pin the package manager
(`packageManager` plus CI), drop `shamefully-hoist`, allow native builds, regenerate the lockfile,
fix implicit dependencies, and refresh the GitHub Actions used by CI.

## Acceptance criteria

- [x] install works on the pinned runtime and package manager; lockfile regenerated
- [x] the runtime is pinned in the repo (`.nvmrc`, `engines`) and CI reads `.nvmrc`; CI uses current
      `setup-node` / `pnpm/action-setup`
- [x] `.npmrc` no longer contains `shamefully-hoist`
- [x] native module builds are allowlisted in the workspace config, not approved interactively
- [x] `pnpm build`, `pnpm lint`, `pnpm test` green across the workspace

## Verification

Re-verified on 2026-11-12 while migrating the tracker into the repo, with `.nvmrc` still naming the
pinned runtime and `onlyBuiltDependencies` in `pnpm-workspace.yaml`:

- `pnpm install --frozen-lockfile` — clean install, no interactive prompts
- `pnpm lint` — green across all five packages
- `pnpm test` — web suite green
- `pnpm build` — backend, blocks, ui lib and web all build

## Notes

The original body named the concrete Node/pnpm majors. Those numbers were removed on purpose: the
values live in `.nvmrc` and `package.json#packageManager`, and this repo does not restate versions in
prose.
