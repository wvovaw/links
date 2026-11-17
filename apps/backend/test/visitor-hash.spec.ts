import { describe, expect, it } from "vitest";

import { visitorHashOf } from "../src/analytics/visitor-hash";

const base = { ip: "203.0.113.7", userAgent: "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101" };
const day = new Date("2026-11-17T10:00:00.000Z");

describe("visitorHashOf", () => {
  /* The whole point of a hash instead of a row per visitor: the same person twice looks like the same one. */
  it("is stable for one visitor on one day", () => {
    expect(visitorHashOf({ ...base, at: day })).toBe(visitorHashOf({ ...base, at: new Date(day) }));
  });

  /* Yesterday's hash cannot be joined to today's, which is what makes a month's uniques a sum of days. */
  it("rotates with the day", () => {
    const tomorrow = new Date(day.getTime() + 24 * 60 * 60 * 1000);

    expect(visitorHashOf({ ...base, at: day })).not.toBe(visitorHashOf({ ...base, at: tomorrow }));
  });

  it("does not carry the address", () => {
    const hash = visitorHashOf({ ...base, at: day });

    expect(hash).not.toContain("203.0.113.7");
    expect(hash).not.toContain("203");
  });

  it("is sixteen hex characters", () => {
    expect(visitorHashOf({ ...base, at: day })).toMatch(/^[0-9a-f]{16}$/);
  });

  /* A day boundary is a UTC midnight, so the hour inside it must not move the hash. */
  it("ignores the time inside one UTC day", () => {
    const late = new Date("2026-11-17T23:59:59.000Z");

    expect(visitorHashOf({ ...base, at: day })).toBe(visitorHashOf({ ...base, at: late }));
  });

  it("separates two visitors on the same page", () => {
    expect(visitorHashOf({ ...base, at: day })).not.toBe(
      visitorHashOf({ ...base, ip: "203.0.113.8", at: day }),
    );
  });
});
