import { describe, expect, it } from "vitest";

import { previousRange } from "../src/analytics/range";

describe("previousRange", () => {
  it("returns the same-length window immediately before the range", () => {
    expect(previousRange({ from: "2026-11-10T00:00:00.000Z", to: "2026-11-17T00:00:00.000Z" })).toEqual({
      from: "2026-11-03T00:00:00.000Z",
      to: "2026-11-10T00:00:00.000Z",
    });
  });

  /* No bounds means "all time": there is no window to compare against, and a made-up one would lie. */
  it("has no previous window when a bound is missing", () => {
    expect(previousRange({})).toBeNull();
    expect(previousRange({ from: "2026-11-10T00:00:00.000Z" })).toBeNull();
    expect(previousRange({ to: "2026-11-17T00:00:00.000Z" })).toBeNull();
  });
});
