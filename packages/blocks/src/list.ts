import type { BlockItemField, IBlockPropertyList } from "./types";

/** The rows a `list` property holds: one object per row, keyed by its item fields' `key`. */
export type ListRow = Record<string, unknown>;

/**
 * The item fields of a `list` property. A property definition is stored JSON too — the API takes
 * `blocks` as unknown — so an `itemFields` that is missing or is not an array reads as no fields at
 * all, rather than throwing inside a save or a panel that has to keep working.
 */
export function itemFieldsOf(property: IBlockPropertyList | undefined): BlockItemField[] {
  const itemFields = property?.itemFields;

  return Array.isArray(itemFields) ? itemFields : [];
}

/** The keys a row must fill in to be worth drawing: the item fields whose schema says `required`. */
export function requiredItemKeys(property: IBlockPropertyList | undefined): string[] {
  return itemFieldsOf(property)
    .filter((field) => field.required)
    .map((field) => field.key);
}

/**
 * The stored rows of a `list` property. The value arrives from unvalidated block JSON, so a value that
 * is not an array — a property saved by a version that stored something else — reads as no rows at all.
 */
export function listRows(property: IBlockPropertyList | undefined): ListRow[] {
  const value = property?.value;
  return Array.isArray(value) ? value : [];
}

/**
 * The rows a renderer may draw: every key in `requiredKeys` holds something after trimming, and by
 * default those keys are the property's own required item fields — the schema says what a row needs,
 * so a renderer that passes nothing cannot drift from it. The rows are copies, so a caller that writes
 * to them cannot reach the stored block, and keys the item schema does not declare are carried through
 * — another release, or another block sharing the type, may own them.
 */
export function completeRows(
  property: IBlockPropertyList | undefined,
  requiredKeys: readonly string[] = requiredItemKeys(property),
): ListRow[] {
  return listRows(property)
    .filter((row) => requiredKeys.every((key) => hasContent(row[key])))
    .map((row) => ({ ...row }));
}

function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  return value !== undefined && value !== null;
}
