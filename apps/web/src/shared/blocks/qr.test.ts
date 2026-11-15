import { describe, expect, it } from "vitest";

import { pageAddress, qrSvg } from "./qr";

describe("qrSvg", () => {
  it("renders svg markup sized from the options", () => {
    const svg = qrSvg("https://links.example/me", { size: 160 });

    expect(svg).toContain("<svg");
    expect(svg).toMatch(/width=["']?160/);
  });

  it("applies the requested colours", () => {
    const svg = qrSvg("https://links.example/me", { size: 120, foreground: "#112233", background: "#ffffee" });

    expect(svg).toContain("#112233");
    expect(svg).toContain("#ffffee");
  });

  it("produces different output for different values", () => {
    expect(qrSvg("https://a.example", { size: 100 })).not.toBe(qrSvg("https://b.example", { size: 100 }));
  });

  it("draws the block defaults when no colours are given", () => {
    const svg = qrSvg("https://links.example/me", { size: 160 });

    expect(svg).toContain("#171515");
    expect(svg).toContain("#ffffff");
  });

  it("accepts a functional colour", () => {
    expect(qrSvg("https://links.example/me", { size: 120, foreground: "rgb(17, 34, 51)" })).toContain(
      "rgb(17, 34, 51)",
    );
  });

  /**
   * Block JSON reaches the renderer from the API unvalidated, so every stored value can be any JSON
   * value at all. The size is the one piece the library does not escape — it is written on the root
   * after `renderSVG` has finished — so a non-numeric value must never become markup.
   */
  it("falls back to the default size when the size is not a finite number", () => {
    const injected = qrSvg("https://links.example/me", { size: '1" onload="alert(1)' as unknown as number });

    expect(injected).toContain('width="160"');
    expect(injected).not.toContain("onload");
    expect(qrSvg("https://links.example/me", { size: Number.NaN })).toContain('width="160"');
    expect(qrSvg("https://links.example/me", { size: Number.POSITIVE_INFINITY })).toContain('width="160"');
  });

  /**
   * The library escapes a colour as an attribute but does not check that it is one: `url(...)` would be
   * written into `fill` as a paint server and the page would fetch a third-party document.
   */
  it("falls back to the default colours when a colour is not a colour", () => {
    const svg = qrSvg("https://links.example/me", {
      size: 120,
      foreground: "url(https://third-party.example/paint)",
      background: "javascript:alert(1)",
    });

    expect(svg).toContain("#171515");
    expect(svg).toContain("#ffffff");
    expect(svg).not.toContain("url(");
    expect(svg).not.toContain("href");
    expect(svg).not.toContain("src");
  });

  it("falls back to the default colours for a colour that is not a string at all", () => {
    const svg = qrSvg("https://links.example/me", { size: 120, foreground: 5 as unknown as string });

    expect(svg).toContain("#171515");
  });

  it("returns null for a value that does not fit a qr code", () => {
    expect(qrSvg("x".repeat(5000), { size: 160 })).toBeNull();
  });
});

describe("pageAddress", () => {
  /**
   * The server request URL never carries a fragment and the browser's always can, so dropping the
   * fragment is what keeps the drawn code the same on both sides — and it reads as "this page", not
   * "this scroll position".
   */
  it("drops the fragment and keeps the rest of the address", () => {
    expect(pageAddress(new URL("https://links.example/me"))).toBe("https://links.example/me");
    expect(pageAddress(new URL("https://links.example/me#links"))).toBe("https://links.example/me");
    expect(pageAddress(new URL("https://links.example/me?tab=links#top"))).toBe("https://links.example/me?tab=links");
  });

  it("leaves the url it is given alone", () => {
    const url = new URL("https://links.example/me#top");

    pageAddress(url);

    expect(url.href).toBe("https://links.example/me#top");
  });
});
