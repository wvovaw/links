import type { Link } from "./link.entity";

/**
 * The block ids a stored page holds. `Link.blocks` is `unknown[]` — the API takes block JSON as it comes —
 * so the shape is read defensively and anything without a string id is left out.
 *
 * Every public write checks its `blockId` against this set before it stores anything: the id becomes a row
 * an owner reads, so a block the page does not hold must not be able to write to it.
 */
export function blockIdsOf(link: Link) {
  const stored = link.blocks.map((block) =>
    typeof block === "object" && block !== null ? (block as { id?: unknown }).id : undefined,
  );

  return new Set(stored.filter((id): id is string => typeof id === "string"));
}
