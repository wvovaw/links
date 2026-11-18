export type DeltaDirection = "up" | "down" | "flat";

export interface MetricDelta {
  direction: DeltaDirection;
  /** Signed: the relative change for a count, the point gap for a rate. Zero only when flat. */
  value: number;
}

/** `-0` is zero: a rounded-away change gets a flat chip, never a down arrow with a zero in it. */
function withDirection(value: number): MetricDelta {
  if (value === 0) return { direction: "flat", value: 0 };

  return { direction: value > 0 ? "up" : "down", value };
}

/**
 * A count's change against the previous window, relative to it. `null` when that window has no baseline:
 * a rise from nothing has no rate, and a flat zero is not progress, so no chip is the honest answer.
 */
export function countDelta(current: number, previous: number): MetricDelta | null {
  if (previous === 0) return null;

  return withDirection(Math.round(((current - previous) / previous) * 100));
}

/**
 * A rate's change in percentage points — a relative change of a ratio is not what an owner reads off a
 * percentage. Both rates are fractions of one; `null` again marks the missing baseline.
 */
export function pointsDelta(current: number, previous: number): MetricDelta | null {
  if (previous === 0) return null;

  return withDirection(Math.round((current - previous) * 100));
}
