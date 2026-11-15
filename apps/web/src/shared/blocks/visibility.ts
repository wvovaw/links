import type { IBlockVisibility } from "@links/blocks";

/** An absent or unreadable bound places no limit, so only a real instant can hide a block. */
function parseBound(value: string | undefined): number | null {
  if (!value) return null;

  const instant = Date.parse(value);
  return Number.isNaN(instant) ? null : instant;
}

/**
 * Whether the block belongs on the page at `now`. The clock is an argument so a boundary is decided
 * by the caller, not by whichever millisecond a render happens to land on: `from` is inclusive and
 * `to` is exclusive, so two blocks scheduled back to back never overlap and never leave a gap.
 */
export function isBlockVisible(visibility: IBlockVisibility | undefined, now: Date): boolean {
  if (!visibility) return true;
  if (visibility.hidden) return false;

  const at = now.getTime();
  const from = parseBound(visibility.from);
  const to = parseBound(visibility.to);

  if (from !== null && at < from) return false;
  if (to !== null && at >= to) return false;

  return true;
}
