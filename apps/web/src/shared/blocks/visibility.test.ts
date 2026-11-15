import { describe, expect, it } from "vitest";

import { isBlockVisible } from "./visibility";

/** The clock is always an argument: nothing here reads the wall clock. */
const now = new Date("2026-12-01T12:00:00.000Z");

describe("isBlockVisible", () => {
  it("keeps a block without visibility visible", () => {
    expect(isBlockVisible(undefined, now)).toBe(true);
    expect(isBlockVisible({}, now)).toBe(true);
  });

  it("honours hidden", () => {
    expect(isBlockVisible({ hidden: true }, now)).toBe(false);
  });

  it("treats from as inclusive and to as exclusive", () => {
    expect(isBlockVisible({ from: "2026-12-01T12:00:00.000Z" }, now)).toBe(true);
    expect(isBlockVisible({ from: "2026-12-01T12:00:01.000Z" }, now)).toBe(false);
    expect(isBlockVisible({ to: "2026-12-01T12:00:00.000Z" }, now)).toBe(false);
    expect(isBlockVisible({ to: "2026-12-01T12:00:01.000Z" }, now)).toBe(true);
  });

  it("ignores an unparsable bound", () => {
    expect(isBlockVisible({ from: "yesterday", to: "tomorrow" }, now)).toBe(true);
  });
});
