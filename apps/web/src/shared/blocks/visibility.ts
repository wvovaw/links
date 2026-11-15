import type { IBlock, IBlockVisibility } from "@links/blocks";

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
 *
 * A `from` later than its `to` is a mistake in the stored schedule, not a permanent hide: an inverted
 * range places no limit, because otherwise every instant would satisfy one of its bounds and the block
 * could never be made visible again from the constructor.
 */
export function isBlockVisible(visibility: IBlockVisibility | undefined, now: Date): boolean {
  if (!visibility) return true;
  if (visibility.hidden) return false;

  const from = parseBound(visibility.from);
  const to = parseBound(visibility.to);

  if (from !== null && to !== null && from > to) return true;

  const at = now.getTime();
  if (from !== null && at < from) return false;
  if (to !== null && at >= to) return false;

  return true;
}

/**
 * The blocks that belong on the page at `now`. One clock decides a whole list, so the Nuxt payload and
 * the markup it hydrates are filtered with the same instant: a `to` falling between two clocks would
 * otherwise keep a block's text in the payload while the markup omits it.
 */
export function visibleBlocks(blocks: readonly IBlock[], now: Date): IBlock[] {
  return blocks.filter((block) => isBlockVisible(block.visibility, now));
}
