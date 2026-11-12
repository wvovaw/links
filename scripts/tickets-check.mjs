#!/usr/bin/env node
// Validates the in-repo issue tracker: docs/tickets/*.md
//
// Dependency-free on purpose: it runs in CI and locally, and it must never be the reason a
// contributor has to install something. See docs/tickets/README.md for the rules it enforces.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TICKETS_DIR = join(REPO_ROOT, "docs", "tickets");

const STATUSES = ["backlog", "ready-for-agent", "claimed", "review", "done", "dropped"];
const PRIORITIES = ["low", "medium", "high"];
const AREAS = ["backend", "web", "ui", "blocks", "tooling", "docs"];
const REQUIRED_FIELDS = [
  "type",
  "id",
  "title",
  "status",
  "priority",
  "area",
  "created",
  "updated",
  "blocked_by",
  "blocks",
];
const ID_PATTERN = /^LINKS-\d{3}$/;
const FILE_PATTERN = /^(LINKS-\d{3})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SKIP_FILES = new Set(["README.md", "_template.md"]);

const errors = [];
const warnings = [];
const complain = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

/**
 * Minimal frontmatter reader. Supports the subset the tracker uses:
 *   key: value            (value may be quoted or bare)
 *   key: []               (empty array)
 *   key:                  (followed by `  - item` lines)
 */
function readFrontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;

  const fields = {};
  let lastKey = null;

  for (const raw of text.slice(4, end).split("\n")) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;

    const listItem = raw.match(/^\s+-\s*(.*)$/);
    if (listItem) {
      if (lastKey === null) return null;
      const value = unquote(listItem[1].trim());
      if (!Array.isArray(fields[lastKey])) fields[lastKey] = [];
      fields[lastKey].push(value);
      continue;
    }

    const pair = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!pair) return null;

    const [, key, value] = pair;
    lastKey = key;
    if (value === "" || value === "[]") {
      fields[key] = value === "[]" ? [] : undefined;
    } else {
      fields[key] = unquote(value.trim());
    }
  }

  return fields;
}

function unquote(value) {
  const quoted = value.match(/^"(.*)"$/) ?? value.match(/^'(.*)'$/);
  return quoted ? quoted[1] : value;
}

function section(heading, text) {
  const marker = `\n## ${heading}\n`;
  const start = text.indexOf(marker);
  if (start === -1) return null;
  const rest = text.slice(start + marker.length);
  const next = rest.search(/\n## /);
  return next === -1 ? rest : rest.slice(0, next);
}

const tickets = new Map();

for (const entry of readdirSync(TICKETS_DIR).toSorted()) {
  if (SKIP_FILES.has(entry)) continue;
  if (!entry.endsWith(".md")) continue;

  const file = `docs/tickets/${entry}`;
  const text = readFileSync(join(TICKETS_DIR, entry), "utf8");
  const nameMatch = entry.match(FILE_PATTERN);
  if (!nameMatch) {
    complain(file, "file name must be <ID>-<kebab-slug>.md, e.g. LINKS-042-block-registry.md");
    continue;
  }

  const fields = readFrontmatter(text);
  if (!fields) {
    complain(file, "missing or unparsable YAML frontmatter");
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    if (fields[field] === undefined) complain(file, `frontmatter is missing \`${field}\``);
  }

  if (fields.type !== undefined && fields.type !== "ticket") {
    complain(file, '`type` must be "ticket"');
  }

  const id = fields.id;
  if (id !== undefined) {
    if (!ID_PATTERN.test(id)) complain(file, `\`id\` must look like LINKS-042, got "${id}"`);
    if (id !== nameMatch[1]) complain(file, `\`id\` (${id}) does not match the file name`);
    if (tickets.has(id)) complain(file, `duplicate id ${id}, already used by ${tickets.get(id).file}`);
  }

  if (fields.title !== undefined && String(fields.title).trim() === "") {
    complain(file, "`title` is empty");
  }

  if (fields.status !== undefined && !STATUSES.includes(fields.status)) {
    complain(file, `\`status\` must be one of ${STATUSES.join(", ")}, got "${fields.status}"`);
  }

  if (fields.priority !== undefined && !PRIORITIES.includes(fields.priority)) {
    complain(file, `\`priority\` must be one of ${PRIORITIES.join(", ")}, got "${fields.priority}"`);
  }

  if (fields.area !== undefined && !AREAS.includes(fields.area)) {
    complain(file, `\`area\` must be one of ${AREAS.join(", ")}, got "${fields.area}"`);
  }

  for (const field of ["created", "updated"]) {
    const value = fields[field];
    if (value === undefined) continue;
    if (!DATE_PATTERN.test(value)) {
      complain(file, `\`${field}\` must be YYYY-MM-DD, got "${value}"`);
    }
  }

  if (DATE_PATTERN.test(fields.created ?? "") && DATE_PATTERN.test(fields.updated ?? "")) {
    if (fields.updated < fields.created) complain(file, "`updated` is earlier than `created`");
  }

  for (const field of ["blocked_by", "blocks"]) {
    const value = fields[field];
    if (value === undefined) continue;
    if (!Array.isArray(value)) {
      complain(file, `\`${field}\` must be a list (use [] when empty)`);
      continue;
    }
    for (const ref of value) {
      if (!ID_PATTERN.test(ref)) complain(file, `\`${field}\` contains "${ref}", which is not a ticket id`);
      if (ref === id) complain(file, `\`${field}\` refers to itself`);
    }
  }

  for (const heading of ["What to build", "Acceptance criteria"]) {
    if (section(heading, text) === null) complain(file, `missing "## ${heading}" section`);
  }

  if (fields.status === "done") {
    if (section("Verification", text) === null) {
      complain(file, 'status is `done` but there is no "## Verification" section');
    }
    const criteria = section("Acceptance criteria", text) ?? "";
    const unchecked = criteria.split("\n").filter((line) => /^\s*-\s*\[ \]/.test(line));
    if (unchecked.length > 0) {
      complain(file, `status is \`done\` but ${unchecked.length} acceptance criteria are unchecked`);
    }
  }

  if (id !== undefined) tickets.set(id, { file, fields });
}

for (const [id, { file, fields }] of tickets) {
  for (const [field, inverse] of [
    ["blocked_by", "blocks"],
    ["blocks", "blocked_by"],
  ]) {
    const refs = Array.isArray(fields[field]) ? fields[field] : [];
    for (const ref of refs) {
      if (!ID_PATTERN.test(ref)) continue;
      const target = tickets.get(ref);
      if (!target) {
        complain(file, `\`${field}\` refers to ${ref}, which does not exist`);
        continue;
      }
      const inverseRefs = Array.isArray(target.fields[inverse]) ? target.fields[inverse] : [];
      if (!inverseRefs.includes(id)) {
        warn(file, `\`${field}\` contains ${ref}, but ${ref} does not list ${id} in \`${inverse}\``);
      }
    }
  }
}

// Blocker cycles: a ticket can never become ready if it waits on itself through a chain.
const state = new Map();
const walk = (id, trail) => {
  if (state.get(id) === "done") return;
  if (state.get(id) === "visiting") {
    complain(tickets.get(id)?.file ?? id, `blocked_by cycle: ${[...trail, id].join(" → ")}`);
    return;
  }
  state.set(id, "visiting");
  const refs = tickets.get(id)?.fields.blocked_by;
  for (const ref of Array.isArray(refs) ? refs : []) {
    if (tickets.has(ref)) walk(ref, [...trail, id]);
  }
  state.set(id, "done");
};

for (const id of tickets.keys()) walk(id, []);

for (const line of warnings) console.warn(`warning  ${line}`);

if (errors.length > 0) {
  for (const line of errors) console.error(`error    ${line}`);
  console.error(`\ntickets:check failed — ${errors.length} problem(s) in ${tickets.size} ticket(s)`);
  process.exit(1);
}

console.log(`tickets:check passed — ${tickets.size} ticket(s), ${warnings.length} warning(s)`);
