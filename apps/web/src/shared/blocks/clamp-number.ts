/**
 * A number property as it reaches the page. Stored block JSON is unvalidated, and the `min`/`max` a
 * field declares are HTML attributes only: a cleared input stores `""` and an over-typed value keeps
 * whatever was typed, so a raw interpolation would publish `--height: px` or a length outside the
 * design. The result is always a finite number inside `[min, max]`.
 */
export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;

  return Math.min(max, Math.max(min, value));
}
