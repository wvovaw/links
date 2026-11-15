import { afterEach, describe, expect, it, vi } from "vitest";

import { trackBlockEvent } from "./analytics";

/** Stands in for the browser's own `navigator`, which is where a beacon is sent from. */
function stubBeacon(sendBeacon: () => unknown) {
  const beacon = vi.fn(sendBeacon);
  vi.stubGlobal("navigator", { sendBeacon: beacon });

  return beacon;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("trackBlockEvent", () => {
  it("posts the event as a json blob to the page's events endpoint", async () => {
    const beacon = stubBeacon(() => true);

    trackBlockEvent({ slug: "my-page", blockId: "b1", kind: "click", origin: "https://api.example" });

    expect(beacon).toHaveBeenCalledTimes(1);

    const [url, body] = beacon.mock.calls[0] as [string, Blob];

    expect(url).toBe("https://api.example/public/links/my-page/events");
    expect(JSON.parse(await body.text())).toEqual({ blockId: "b1", kind: "click" });
  });

  /* Server rendering and an old browser both reach this without a beacon; neither may break the page. */
  it("stays silent where the browser has no beacon to send", () => {
    vi.stubGlobal("navigator", {});

    expect(() => trackBlockEvent({ slug: "my-page", blockId: "b1", kind: "view", origin: "" })).not.toThrow();
  });

  it("swallows a beacon that throws, so the click still follows its link", () => {
    stubBeacon(() => {
      throw new Error("blocked by the browser");
    });

    expect(() => trackBlockEvent({ slug: "my-page", blockId: "b1", kind: "click", origin: "" })).not.toThrow();
  });
});
