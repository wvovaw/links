# Agent workflow

How work happens in this repo. The goal is that any agent session — or any person coming back after
months of absence — can pick up work without archaeology.

## Principles

1. **One ticket, one deliverable.** A ticket states what to build and how it will be judged. If you
   cannot state the acceptance criteria, the ticket is not ready.
2. **Small verifiable increments.** A ticket should end in a state where `pnpm verify` is green.
   Broad rewrites are split into tickets, not executed in one pass.
3. **Evidence over memory.** Every closed ticket records the commands that proved it works. "Done"
   without verification is not done.
4. **Write the decision down before the branch dies.** Insights that live only in a throwaway branch
   or a chat are lost. See [Research probes](#research-probes).

## The tracker

Tickets are markdown files in [`docs/tickets/`](tickets/), one file per ticket, validated by
working markdown. The format, statuses and field semantics are documented in
[`docs/tickets/README.md`](tickets/README.md). The agent-facing procedure lives in the
`.agents/skills/issue-tracker` skill.

Lifecycle:

```
backlog → ready-for-agent → claimed → review → done
                  ↘ dropped (with a reason in the body)
```

- Pick work only from `ready-for-agent`; a ticket whose `blocked_by` is not fully `done` is not
  ready by definition.
- Move to `claimed` in the same commit where work starts, so two sessions do not collide.
- `review` means implementation is finished and evidence is written, but the change is not yet
  accepted.
- Closing a ticket means: acceptance criteria checked off, `## Verification` filled with real
  commands and their outcome, and the ticket body left readable as history.

## Gates and definition of done

The gate is one command:

```bash
pnpm verify   # lint + fmt + build + test
```

The same gate runs in CI on every pull request — see [CI](#ci) below.

A ticket is done when, in order:

1. The tracker is consistent: the edited tickets still honour the rules in
   [`docs/tickets/README.md`](tickets/README.md) — checked by reading, not by a tool.
2. `pnpm lint` passes **without touching files** (`git status` clean afterwards).
3. `pnpm fmt` passes — formatting is checked, not applied.
4. `pnpm build` passes for every package, libraries included. Build comes before test on purpose:
   the web suite imports the UI library preset from dist.
5. `pnpm test` passes and the test process exits on its own.
6. Anything touching runtime behaviour was exercised for real, not only compiled: the API against
   its Bruno collection (`apps/backend/.bruno`), the constructor and a public page in a browser.
7. `## Verification` lists what was actually run and what came out.

Never mark a ticket done because a build compiled. Compilation is the floor.

## CI

[`ci.yml`](../../.github/workflows/ci.yml) reproduces the gate on GitHub Actions: `pnpm install
--frozen-lockfile`, then lint, fmt, build and test, in that order — build first because the web
suite imports the UI preset from dist. It runs on every pull request and on pushes to `master`.

A step failure does not cut the run short: the remaining steps still run, so one red run reports
every problem instead of the first one. The verdict lands in the run summary and, on pull requests,
in a single sticky comment that the workflow keeps updated instead of appending a new one per push.
The job is a single check named `verify`; making merges depend on it is branch-protection
configuration in the GitHub settings, not something this repository stores.

## Dependency upgrades

Upgrades happen in waves, not in one pass, and every major has a written trace.

- **Waves.** Tooling gates first, then patch/minor, then majors grouped by blast radius (runtime
  deps, libraries, tooling, framework). Each wave is a ticket and a branch.
- **Read the official migration guide** for every major before changing the version, and link it in
  the journal. Framework majors (NestJS, TypeORM, TypeScript, Nuxt) get their own ticket even if
  they arrive in the same wave.
- **Record in [`docs/upgrades/`](upgrades/).** Per package: from → to, the guide that was read, what
  was changed, what was deferred and why, and what it took to verify.
- **Never mix formatting with logic.** A formatting pass is its own commit; so is a lockfile churn
  caused by a peer resolution change.
- **Check the runtime floor** a new version requires against `.nvmrc` before upgrading, not after.
- After a wave: one version per package where possible, and every intentional duplicate explained in
  the journal. `pnpm why <pkg>` is the tool.

## Research probes

Some questions are not answerable by reading — they need a throwaway prototype (3 shapes of a render
contract, an op set, a prerender pipeline).

- The probe lives in a branch named `probe/<slug>` and is never merged. Scratch code goes in
  `.scratch/`, which is ignored.
- **Before the branch is deleted, the answer must exist outside it**: a ticket in `docs/tickets/`, or
  a note under `docs/architecture/`. Include the question, the verdict, what proved it, and what
  stays unimplemented.
- A probe without a recorded verdict is deleted without ceremony — no verdict, no value. Do not keep
  probe branches around "just in case": they decay, accumulate conflicts and pretend to be work.
- If a probe's verdict becomes real work, it becomes a ticket with acceptance criteria. Probes never
  graduate straight into code.

## Documentation rules

- **No version numbers in docs.** Not the runtime, not packages. Version-dependent statements point
  at `.nvmrc`, `package.json#packageManager`, `engines`, or the package's own `package.json`.
  Two exceptions, both historical rather than referential: [`docs/upgrades/`](upgrades/), a migration
  journal that has to record what moved, and the `## Verification` section of a ticket, where the
  exact command that produced the evidence may be quoted verbatim. Neither is ever the answer to
  "what do we run now".
- `AGENTS.md` stays short: identity, layout, truth sources, commands, invariants, map of `docs/`.
  Detail belongs in `docs/agents/`, procedures in skills, work in `docs/tickets/`.
- One documentation directory: lowercase `docs/` at the repo root.
- Docs describe the repo as it is, not as it was. When behaviour changes, the doc change is part of
  the same ticket.

## Closing ritual

Checklist an agent runs before writing `status: done`:

- [ ] acceptance criteria in the ticket are all checked
- [ ] `pnpm verify` green, output captured in `## Verification`
- [ ] docs and `AGENTS.md` still true (no stale versions, no dead paths)
- [ ] `docs/upgrades/` updated if dependency versions moved
- [ ] follow-up work, if any, exists as a new ticket instead of a comment
