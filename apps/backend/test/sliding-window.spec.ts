import { afterEach, describe, expect, it, vi } from "vitest";

import { SlidingWindow } from "../src/common/sliding-window";

const messages = { key: "key refused", scope: "scope refused" };
const limits = { perKey: 2, perScope: 3 };

/** One window per test: the maps are the thing under test, so a shared instance would carry state over. */
function windowOf() {
  return new SlidingWindow(limits);
}

function clockAt(iso: string) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
}

describe("SlidingWindow memory", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /* The window is keyed by traffic now, so an entry that can never be reached again must not be kept. */
  it("drops a key whose window has emptied", () => {
    clockAt("2026-11-17T10:00:00.000Z");
    const window = windowOf();

    window.admit("page-1", "page-1:a", messages);
    vi.setSystemTime(new Date("2026-11-17T10:01:01.000Z"));
    window.admit("page-1", "page-1:b", messages);

    expect(window.keyCount).toBe(1);
    expect(window.scopeCount).toBe(1);
  });

  it("keeps a key still inside its window", () => {
    clockAt("2026-11-17T10:00:00.000Z");
    const window = windowOf();

    window.admit("page-1", "page-1:a", messages);
    window.admit("page-1", "page-1:a", messages);
    vi.setSystemTime(new Date("2026-11-17T10:00:30.000Z"));
    window.admit("page-1", "page-1:b", messages);

    expect(window.keyCount).toBe(2);
  });
});

describe("SlidingWindow limits", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("still refuses the third request for one key in a minute", () => {
    clockAt("2026-11-17T10:00:00.000Z");
    const window = windowOf();

    window.admit("page-1", "page-1:a", messages);
    window.admit("page-1", "page-1:a", messages);

    expect(() => window.admit("page-1", "page-1:a", messages)).toThrowError(messages.key);
  });
});
