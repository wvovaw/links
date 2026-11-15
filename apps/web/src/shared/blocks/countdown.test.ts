import { describe, expect, it } from "vitest";

import { countdownParts, formatCountdown } from "./countdown";

/** The clock is always an argument: nothing here reads the wall clock. */
const target = "2026-12-01T00:00:00.000Z";

describe("countdownParts", () => {
  it("splits the remaining time into parts", () => {
    const parts = countdownParts(target, new Date("2026-11-30T23:59:00.000Z"));

    expect(parts).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0, finished: false });
  });

  it("is finished at and after the target instant", () => {
    expect(countdownParts(target, new Date("2026-12-01T00:00:00.000Z")).finished).toBe(true);
    expect(countdownParts(target, new Date("2026-12-02T00:00:00.000Z"))).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
    });
  });

  it("is finished when the target is not a date", () => {
    expect(countdownParts("nonsense", new Date()).finished).toBe(true);
    expect(countdownParts("", new Date()).finished).toBe(true);
  });

  it("counts whole seconds, so a fraction of one never shows a second that is not there", () => {
    expect(countdownParts(target, new Date("2026-11-30T23:59:58.500Z")).seconds).toBe(1);
  });

  it("carries a long countdown into days", () => {
    expect(countdownParts(target, new Date("2026-11-25T21:56:56.000Z"))).toEqual({
      days: 5,
      hours: 2,
      minutes: 3,
      seconds: 4,
      finished: false,
    });
  });
});

describe("formatCountdown", () => {
  it("pads the clock parts and drops the days while there are none", () => {
    expect(formatCountdown({ days: 0, hours: 0, minutes: 1, seconds: 0, finished: false })).toBe("00:01:00");
  });

  it("names the days once there is at least one", () => {
    expect(formatCountdown({ days: 5, hours: 2, minutes: 3, seconds: 4, finished: false })).toBe("5d 02:03:04");
  });

  it("formats a finished countdown as a zero clock", () => {
    expect(formatCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true })).toBe("00:00:00");
  });
});
