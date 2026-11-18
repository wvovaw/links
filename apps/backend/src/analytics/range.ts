/** A bounded window, as the two ISO strings the read queries take. */
interface Range {
  from: string;
  to: string;
}

/**
 * The window a dashboard compares a range against: the same length, ending where the range starts.
 *
 * The upper bound is exclusive, and the read queries filter with `<=`, so it is returned one second short: a
 * stored timestamp has whole seconds, which makes `from − 1s` the last second the range does not own. A row
 * written exactly at `from` then counts once — in the range the caller asked about, never in both.
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
    to: new Date(from.getTime() - 1000).toISOString(),
  };
}
