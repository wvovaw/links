import { describe, expect, it } from "vitest";

import { clampNumber } from "./clamp-number";

describe("clampNumber", () => {
  it("keeps a stored number inside its range", () => {
    expect(clampNumber(56, 40, 96, 56)).toBe(56);
  });

  it("clamps a value outside the range the field offers", () => {
    expect(clampNumber(5000, 40, 96, 56)).toBe(96);
    expect(clampNumber(-5, 40, 96, 56)).toBe(40);
  });

  it.each([
    ["the empty string a cleared input stores", ""],
    ["null", null],
    ["undefined", undefined],
    ["NaN", Number.NaN],
    ["Infinity", Number.POSITIVE_INFINITY],
    ["a string that looks numeric", "72"],
  ])("falls back for %s", (_case, value) => {
    expect(clampNumber(value, 40, 96, 56)).toBe(56);
  });
});
