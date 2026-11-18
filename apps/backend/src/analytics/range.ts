/** A bounded window, as the two ISO strings the read queries take. */
interface Range {
  from: string;
  to: string;
}

/**
 * The window a dashboard compares a range against: the same length, ending exactly where the range starts,
 * so the two windows meet without overlapping and neither day is counted twice.
 *
 * An unbounded range means "all time", and there is nothing before all time — a made-up window would print
 * a delta against numbers that were never collected, so the caller gets `null` instead.
 */
export function previousRange(range: { from?: string; to?: string }): Range | null {
  if (!range.from || !range.to) return null;

  const from = new Date(range.from);
  const to = new Date(range.to);

  return {
    from: new Date(from.getTime() - (to.getTime() - from.getTime())).toISOString(),
    to: from.toISOString(),
  };
}
