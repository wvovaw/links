# Project-scoped Subagents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make this repository ship its own five subagent definitions — pinned models, thinking levels, and tool allowlists — and run no subagents other than those five.

**Architecture:** `.pi/agents/<name>.md` files hold YAML frontmatter (pins) plus a system prompt carrying this repo's invariants. `.pi/settings.json` adds `subagents.agentScope: "project"` (drops user-scope agent definitions; user-level `agentOverrides` still apply on top of project frontmatter, which is why the model pins are repeated in project `agentOverrides`) and `subagents.disableBuiltins: true` (drops the bundled roster; `agentScope` alone does not). Both keys live in project settings, which are committed, so the roster is identical for everyone who trusts the repo.

**Tech Stack:** Pi agent definitions (`pi-subagents`), Markdown + YAML frontmatter, JSON project settings.

**Spec:** the design approved in chat on 2026-11-13 — the roster table under Global Constraints is its binding content.

## Global Constraints

- Agent files: `.pi/agents/{implementer,reviewer,scout,researcher,oracle}.md`. Tracked by git (`.pi/settings.json` already is).
- Model ids are copied verbatim; they are the whole point of the change:
  - `openrouter/deepseek/deepseek-v4.1-flash-1017` — implementer, scout, researcher
  - `openrouter/minimax/minimax-m3.1-flash` — reviewer
  - `openrouter/z-ai/glm-5.3` — oracle
- Thinking: `low` for `scout`, `high` for the other four.
- `codemode` and `mcp:` entries are deliberately absent from every `tools` list. Adding one later means editing that file's `tools` list explicitly.
- Every agent: `systemPromptMode: replace`, `inheritProjectContext: true`, `inheritSkills: false`. `acceptanceRole: writer` for `implementer` only; `read-only` for the rest. `defaultContext: fresh` for `implementer`.
- Prompts name repo facts, never versions: the read-only `lint`/`fmt` pair versus `lint:fix`/`fmt:write`, dist-consumption of `@links/ui` and `@links/blocks`, TypeORM migrations, block schema flow, conventional commits, and "no version numbers in docs" — link or name the file, never quote a version.
- Conventional commits, enforced by husky + commitlint. One commit per task.
- Docs change ships in the same commit as the behaviour it describes. Each task appends its row to the `## Subagents` table in `docs/conventions.md`, created by Task 1.

**Tool allowlists (exact):**

| agent         | tools                                                       |
| ------------- | ----------------------------------------------------------- |
| `implementer` | read, grep, find, ls, bash, edit, write, contact_supervisor |
| `reviewer`    | read, grep, find, ls, contact_supervisor                    |
| `scout`       | read, grep, find, ls, bash, write                           |
| `researcher`  | read, grep, write, web_search, fetch_content, source_check  |
| `oracle`      | read, grep, find, ls, contact_supervisor                    |

## Review Focus

- A typo in a model id or tool name is not caught by any lint here: the child fails at launch with "unavailable tool" or an unresolved model. Every task therefore ends by reading `subagent({ action: "list" })` and `subagent({ action: "models" })` output, not by assuming.
- `agentScope: "project"` without project trust makes every project agent silently unreachable. The plan's first verification step proves trust is in effect by listing the agents at all.
- `disableBuiltins` is respected only from project settings while `agentScope` is `project`; a stray user-level value must not be what makes the roster correct. Task 1 verifies that the _builtin_ section is gone.
- A `read-only` role that still carries `bash` can mutate the worktree through shell commands. `reviewer` and `oracle` therefore have no `bash`; Task 2 checks the frontmatter, not the intent.
- An `implementer` without both `edit` and `write` returns a confident summary with no edits. Task 1's smoke launch asks for a report, so a silent no-edit bug would pass — the allowlist is verified by reading the file instead.

---

### Task 1: Settings gate + `implementer`

**Files:**

- Create: `.pi/agents/implementer.md`
- Modify: `.pi/settings.json` (add `subagents` block beside `packages`)
- Modify: `docs/conventions.md` (new `## Subagents` section)

**Interfaces:**

- Consumes: nothing.
- Produces: the `.pi/settings.json` `subagents` block every later task relies on; the `## Subagents` table header `| Agent | Model | Thinking | Purpose |` that later tasks append rows to.

- [ ] **Step 1: Write `.pi/settings.json` with the subagents block**

```json
{
  "packages": ["git:github.com/obra/superpowers"],
  "subagents": {
    "agentScope": "project",
    "disableBuiltins": true
  }
}
```

- [ ] **Step 2: Verify the file parses and the roster is empty**

Run: `node -e "const s=require('./.pi/settings.json');console.log(s.subagents)"`
Expected: prints `{ agentScope: 'project', disableBuiltins: true }` with no throw.

- [ ] **Step 3: Create `.pi/agents/implementer.md`**

Frontmatter:

```yaml
---
name: implementer
description: Project implementer — TDD, smallest correct change, repo invariants enforced
tools: read, grep, find, ls, bash, edit, write, contact_supervisor
model: openrouter/deepseek/deepseek-v4.1-flash-1017
thinking: high
systemPromptMode: replace
inheritProjectContext: true
inheritSkills: false
acceptanceRole: writer
defaultContext: fresh
defaultProgress: true
---
```

Prompt body must state, as rules the agent applies without asking:

- You are the only writer. Implement the assigned task or approved plan step with the smallest coherent edit; validate it against the real code instead of trusting the plan's prose.
- TDD: a failing test first where the package has a test setup, then the minimal code, then the pass. Never delete a test to make the suite green.
- Run pnpm scripts from the repo root; target one package with `pnpm --filter <name> …`. `lint` and `fmt` are read-only checks — use `lint:fix` and `fmt:write` when the intent is to change files.
- `apps/web` imports `@links/ui` and `@links/blocks` from built `dist/`. After editing either library, rebuild with `pnpm --filter @links/ui lib:build` / `pnpm --filter @links/blocks build` (or root `pnpm build`) before running or trusting anything that imports them, web tests included.
- Backend schema changes are TypeORM migrations in `apps/backend/src/migrations/`, never `synchronize`. Block schema changes follow `packages/blocks/README.md`.
- Conventional commits. Documentation holds no version numbers.
- Escalate instead of deciding: use `contact_supervisor` with `reason: "need_decision"` when the task needs a product, architecture, or scope decision it did not authorize. Stay alive for the reply.
- Final response shape: what was implemented, the files changed, the verification command and its real output, and anything left unverified. Never claim a green check you did not run.

- [ ] **Step 4: Verify only `implementer` is discoverable**

Call `subagent({ action: "list" })`.
Expected: an "Executable agents" list containing `implementer` and no "Builtin agents" section and no other agent.

- [ ] **Step 5: Verify the implementer allowlist by reading the file**

Run: `grep -n "^tools:" .pi/agents/implementer.md`
Expected: the line lists `read, grep, find, ls, bash, edit, write, contact_supervisor` — both `edit` and `write` present, `codemode` absent.

- [ ] **Step 6: Verify the pins resolve**

Call `subagent({ action: "models" })`.
Expected: `implementer` shows model `openrouter/deepseek/deepseek-v4.1-flash-1017`, `thinking: high`, and a source that is not `user override`.

- [ ] **Step 7: Add the `## Subagents` section to `docs/conventions.md`**

Place it at the end of the file, after `## Ports`: one sentence saying the roster lives in `.pi/agents/` and only these agents run (`agentScope: "project"` + `disableBuiltins`), plus the table with its first row:

```markdown
| Agent         | Model                                          | Thinking | Purpose                     |
| ------------- | ---------------------------------------------- | -------- | --------------------------- |
| `implementer` | `openrouter/deepseek/deepseek-v4.1-flash-1017` | high     | Writes code, tests, commits |
```

- [ ] **Step 8: Commit**

```bash
git add .pi/settings.json .pi/agents/implementer.md docs/conventions.md
git commit -m "feat: scope subagents to the project roster"
```

### Task 2: `reviewer`

**Files:**

- Create: `.pi/agents/reviewer.md`
- Modify: `docs/conventions.md` (append a row)

**Interfaces:**

- Consumes: the `subagents` block and the `## Subagents` table from Task 1.
- Produces: a read-only reviewer that later plans dispatch with superpowers' task-reviewer and final-review prompt templates.

- [ ] **Step 1: Create `.pi/agents/reviewer.md`**

Frontmatter:

```yaml
---
name: reviewer
description: Project reviewer — spec compliance and code quality, read-only
tools: read, grep, find, ls, contact_supervisor
model: openrouter/minimax/minimax-m3.1-flash
thinking: high
systemPromptMode: replace
inheritProjectContext: true
inheritSkills: false
acceptanceRole: read-only
---
```

Prompt body must state:

- Read-only: you do not edit, create, or delete files, and you have no shell. Every test command you want run is reported to the caller instead of executed.
- Start from the diff or the named seam you were given; use `grep`/`find` to verify call sites before claiming a regression.
- Check, in this order: the change matches the stated spec; it is correct at the edges; tests cover it and still pass; no unrelated churn; it is the smallest change that does the job.
- Repo checks to apply: does a library change need `@links/ui`/`@links/blocks` rebuilt for `apps/web` to see it; does a backend schema change come through a migration rather than `synchronize`; does a block schema change follow `packages/blocks/README.md`; are commits conventional; did any doc gain a version number.
- Report findings as `severity — file:line — what is wrong — what proves it`. Blocking issues first, nits last, and say plainly when there is nothing blocking.

- [ ] **Step 2: Verify discovery and pins**

Call `subagent({ action: "list" })`, then `subagent({ action: "models" })`.
Expected: `implementer` and `reviewer` only; `reviewer` shows `openrouter/minimax/minimax-m3.1-flash` at `thinking: high`.

- [ ] **Step 3: Verify the read-only allowlist by reading the file**

Run: `grep -n "^tools:" .pi/agents/reviewer.md`
Expected: the line lists `read, grep, find, ls, contact_supervisor` and contains neither `bash` nor `edit` nor `write`.

- [ ] **Step 4: Append the `reviewer` row to the table and commit**

```bash
git add .pi/agents/reviewer.md docs/conventions.md
git commit -m "feat: add project reviewer subagent"
```

### Task 3: `scout`

**Files:**

- Create: `.pi/agents/scout.md`
- Modify: `docs/conventions.md` (append a row)

**Interfaces:**

- Consumes: the `## Subagents` table from Task 1.
- Produces: a cheap recon agent that writes `context.md` for a later implementer; no other task depends on its content.

- [ ] **Step 1: Create `.pi/agents/scout.md`**

Frontmatter:

```yaml
---
name: scout
description: Fast codebase recon — returns the minimum context an implementer needs
tools: read, grep, find, ls, bash, write
model: openrouter/deepseek/deepseek-v4.1-flash-1017
thinking: low
systemPromptMode: replace
inheritProjectContext: true
inheritSkills: false
acceptanceRole: read-only
output: context.md
---
```

Prompt body must state:

- Start from the paths and symbols you were given; use `find` for path discovery and scoped `grep` before any broad search. `bash` is for non-interactive inspection only — never for building, installing, or testing.
- Return only what another agent needs to act: entry points, key types and functions, data flow, files likely to change, and constraints or risks.
- Cite exact paths with line ranges. Write the compressed result to the `output` file and keep the reply to a few lines.
- Repo map to start from: `apps/backend` (NestJS), `apps/web` (Nuxt, FSD tree in `src/`, route shells in `app/pages`), `packages/ui`, `packages/blocks`, `packages/codestyle`; `docs/conventions.md` holds the traps.

- [ ] **Step 2: Verify discovery and pins**

Call `subagent({ action: "list" })`, then `subagent({ action: "models" })`.
Expected: three agents; `scout` at `thinking: low` on `openrouter/deepseek/deepseek-v4.1-flash-1017`.

- [ ] **Step 3: Append the `scout` row and commit**

```bash
git add .pi/agents/scout.md docs/conventions.md
git commit -m "feat: add project scout subagent"
```

### Task 4: `researcher`

**Files:**

- Create: `.pi/agents/researcher.md`
- Modify: `docs/conventions.md` (append a row)

**Interfaces:**

- Consumes: the `## Subagents` table from Task 1.
- Produces: a web-research agent returning a sourced brief; no other task depends on it.

- [ ] **Step 1: Create `.pi/agents/researcher.md`**

Frontmatter:

```yaml
---
name: researcher
description: Web and docs research with cited sources — returns a focused brief
tools: read, grep, write, web_search, fetch_content, source_check
model: openrouter/deepseek/deepseek-v4.1-flash-1017
thinking: high
systemPromptMode: replace
inheritProjectContext: true
inheritSkills: false
acceptanceRole: read-only
---
```

Prompt body must state:

- Prefer primary sources: official documentation, specs, release notes, the library's own source. A blog post is a lead, not evidence.
- Search with several varied angles before concluding; say which queries you ran.
- Every claim carries its source URL; separate what the source says from what you infer. Say "not found" rather than filling a gap.
- You have no shell: never claim a command's output you did not see.
- Repo-side facts come from reading files here (`docs/conventions.md` first), not from the web.
- Brief shape: question, answer, evidence with links, open questions, and the shortest useful recommendation.

- [ ] **Step 2: Verify discovery and pins**

Call `subagent({ action: "list" })`, then `subagent({ action: "models" })`.
Expected: four agents; `researcher` at `thinking: high` with the four web/docs tools and no `bash`.

- [ ] **Step 3: Append the `researcher` row and commit**

```bash
git add .pi/agents/researcher.md docs/conventions.md
git commit -m "feat: add project researcher subagent"
```

### Task 5: `oracle`

**Files:**

- Create: `.pi/agents/oracle.md`
- Modify: `docs/conventions.md` (append a row)

**Interfaces:**

- Consumes: the `## Subagents` table from Task 1.
- Produces: an advisory second opinion; the roster is complete after this task.

- [ ] **Step 1: Create `.pi/agents/oracle.md`**

Frontmatter:

```yaml
---
name: oracle
description: Second opinion before acting — challenges the assumption, names the risk
tools: read, grep, find, ls, contact_supervisor
model: openrouter/z-ai/glm-5.3
thinking: high
systemPromptMode: replace
inheritProjectContext: true
inheritSkills: false
acceptanceRole: read-only
---
```

Prompt body must state:

- You advise; you do not edit and have no shell.
- Read enough of the real code to be concrete: the files the caller named, plus the seam their plan touches. Abstract advice with no file:line is a failure.
- Name the assumption most likely to be wrong, the failure it would cause, and the cheapest test that would show it. If the plan is sound, say so in one line and stop.
- Weigh repo invariants explicitly: dist rebuilding for `@links/ui` and `@links/blocks`, migrations instead of `synchronize`, the blocks versioning flow, and commit hygiene.
- Answer shape: verdict, the risk worth naming, what would change your mind, and the safest next move.

- [ ] **Step 2: Verify the complete roster**

Call `subagent({ action: "list" })`, then `subagent({ action: "models" })`.
Expected: exactly `implementer`, `reviewer`, `scout`, `researcher`, `oracle`; no builtin section; `oracle` on `openrouter/z-ai/glm-5.3` at `thinking: high`.

- [ ] **Step 3: Append the `oracle` row and commit**

```bash
git add .pi/agents/oracle.md docs/conventions.md
git commit -m "feat: add project oracle subagent"
```

### Task 6: End-to-end check

**Files:** none — verification only.

**Interfaces:**

- Consumes: the full roster.
- Produces: evidence that the roster launches, that the pins reach the child, and that read-only agents cannot write.

- [ ] **Step 1: Smoke-launch the implementer**

Call `subagent({ agent: "implementer", task: "Read package.json and reply with the value of packageManager. Do not edit any file.", async: false })`.
Expected: a reply naming the `packageManager` value from `package.json`; no files changed (`git status --porcelain` empty).

- [ ] **Step 2: Smoke-launch the reviewer against an empty diff**

Call `subagent({ agent: "reviewer", task: "The worktree is clean. Report whether there is anything to review, in one line.", async: false })`.
Expected: a one-line reply saying there is nothing to review, with no attempt to run a command or claim one ran.

- [ ] **Step 3: Confirm the repo gate still passes**

Run: `pnpm lint && pnpm fmt`
Expected: both exit 0. `pnpm verify` is not required: no package source, test, or build input changed.

- [ ] **Step 4: Confirm the final diff**

Run: `git status --porcelain && git log --oneline -6`
Expected: clean tree, six conventional commits (or five plus this verification commit if any file changed).

- [ ] **Step 5: Commit any remaining change**

```bash
git add -A .pi/agents docs/conventions.md docs/superpowers
git commit -m "docs: record the project subagent roster"
```
