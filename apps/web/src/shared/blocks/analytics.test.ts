import { afterEach, describe, expect, it, vi } from "vitest";

import { readSource, trackBlockEvent, trackPageView } from "./analytics";

/** Stands in for the browser's own `navigator`, which is where a beacon is sent from. */
function stubBeacon(sendBeacon: () => unknown) {
  const beacon = vi.fn(sendBeacon);
  vi.stubGlobal("navigator", { sendBeacon: beacon });

  return beacon;
}

/** The address the visitor landed on, utm tags included. */
function stubAddress(path: string) {
  history.replaceState({}, "", path);
}

/** Where the visitor came from. `document.referrer` is read-only, so the instance's own property replaces it. */
function stubReferrer(value: string) {
  Object.defineProperty(document, "referrer", { value, configurable: true });
}

afterEach(() => {
  vi.unstubAllGlobals();
  stubAddress("/");
  stubReferrer("");
});

describe("readSource", () => {
  /* A tagged link is the visitor telling us where they came from; nothing else they carry outranks it. */
  it("prefers utm tags from the address", () => {
    stubAddress("/p?utm_source=Telegram&utm_medium=social&utm_campaign=Launch");

    expect(readSource()).toEqual({ utmSource: "telegram", utmMedium: "social", utmCampaign: "launch" });
  });

  /* The beacon is cross-origin, so the browser's own Referer header carries our page: the host travels here. */
  it("reads an external referrer as a host", () => {
    stubReferrer("https://www.google.com/search?q=links");

    expect(readSource()).toEqual({ referrerHost: "google.com" });
  });

  /* A visit that started on another of our own pages is a visit, but it was not acquired. */
  it("marks our own origin as internal", () => {
    stubReferrer(`${location.origin}/other-page`);

    expect(readSource()).toEqual({ referrerInternal: true });
  });

  it("treats an unparseable referrer as absent", () => {
    stubReferrer("not a url");

    expect(readSource()).toEqual({});
  });

  it("keeps an empty tag out of the payload", () => {
    stubAddress("/p?utm_source=");

    expect(readSource()).toEqual({});
  });
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

  /* "Clicks by source" needs the click's own source: there is no session to join it to a view through. */
  it("carries the traffic source with the click", async () => {
    const beacon = stubBeacon(() => true);
    stubAddress("/p?utm_source=telegram");

    trackBlockEvent({ slug: "my-page", blockId: "b1", kind: "click", origin: "https://api.example" });

    const [, body] = beacon.mock.calls[0] as [string, Blob];

    expect(JSON.parse(await body.text())).toEqual({ blockId: "b1", kind: "click", utmSource: "telegram" });
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

describe("trackPageView", () => {
  it("sends a view with its source to the views endpoint", async () => {
    const beacon = stubBeacon(() => true);
    stubAddress("/p?utm_source=linkedin&utm_medium=social");

    trackPageView({ slug: "my-page", origin: "https://api.example" });

    const [url, body] = beacon.mock.calls[0] as [string, Blob];

    expect(url).toBe("https://api.example/public/links/my-page/views");
    expect(JSON.parse(await body.text())).toEqual({ utmSource: "linkedin", utmMedium: "social" });
  });

  /* Analytics may never cost a visitor the page: a blocked beacon is not a page error. */
  it("swallows a beacon that throws", () => {
    stubBeacon(() => {
      throw new Error("blocked by the browser");
    });

    expect(() => trackPageView({ slug: "my-page", origin: "" })).not.toThrow();
  });

  it("stays silent where the browser has no beacon to send", () => {
    vi.stubGlobal("navigator", {});

    expect(() => trackPageView({ slug: "my-page", origin: "" })).not.toThrow();
  });
});
