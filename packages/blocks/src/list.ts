import type { IBlockPropertyList } from "./types";

/** The rows a `list` property holds: one object per row, keyed by its item fields' `key`. */
export type ListRow = Record<string, unknown>;

/**
 * The stored rows of a `list` property. The value arrives from unvalidated block JSON, so a value that
 * is not an array — a property saved by a version that stored something else — reads as no rows at all.
 */
export function listRows(property: IBlockPropertyList | undefined): ListRow[] {
  const value = property?.value;
  return Array.isArray(value) ? value : [];
}

/**
 * The rows a renderer may draw: every one of `requiredKeys` holds something after trimming. The rows
 * are copies, so a caller that writes to them cannot reach the stored block, and keys the item schema
 * does not declare are carried through — another release, or another block sharing the type, may own
 * them.
 */
export function completeRows(property: IBlockPropertyList | undefined, requiredKeys: readonly string[]): ListRow[] {
  return listRows(property)
    .filter((row) => requiredKeys.every((key) => hasContent(row[key])))
    .map((row) => ({ ...row }));
}

function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
}
