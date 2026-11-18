import { describe, expect, it } from "vitest";

import { countDelta, pointsDelta } from "./delta";

describe("countDelta", () => {
  it("reports a relative change with its direction", () => {
    expect(countDelta(112, 100)).toEqual({ direction: "up", value: 12 });
    expect(countDelta(90, 100)).toEqual({ direction: "down", value: -10 });
    expect(countDelta(100, 100)).toEqual({ direction: "flat", value: 0 });
  });

  /* A rise from nothing has no rate, and a flat zero is not progress: no chip is the honest answer. */
  it("has no delta when the previous window has no baseline", () => {
    expect(countDelta(5, 0)).toBeNull();
    expect(countDelta(0, 0)).toBeNull();
  });
});

describe("pointsDelta", () => {
  it("reports a ratio change in percentage points", () => {
    expect(pointsDelta(0.087, 0.081)).toEqual({ direction: "up", value: 1 });
    expect(pointsDelta(0.081, 0.087)).toEqual({ direction: "down", value: -1 });
  });

  it("has no delta with no baseline rate", () => {
    expect(pointsDelta(0.087, 0)).toBeNull();
  });
});
