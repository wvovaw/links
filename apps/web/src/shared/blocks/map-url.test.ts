import { describe, expect, it } from "vitest";

import { mapEmbedUrl, mapLinkUrl } from "./map-url";

describe("mapEmbedUrl", () => {
  it("encodes the address into the keyless maps embed", () => {
    expect(mapEmbedUrl("Tverskaya 1, Moscow", 12)).toBe(
      "https://maps.google.com/maps?q=Tverskaya%201%2C%20Moscow&z=12&output=embed",
    );
  });

  it("returns null for an empty or whitespace address", () => {
    expect(mapEmbedUrl("   ", 12)).toBeNull();
    expect(mapEmbedUrl("", 12)).toBeNull();
  });

  it("clamps the zoom into the provider range", () => {
    expect(mapEmbedUrl("Moscow", 99)).toContain("z=20");
    expect(mapEmbedUrl("Moscow", 0)).toContain("z=1");
  });

  /* Stored JSON is unvalidated, so a level that is not a number keeps the block's default. */
  it.each([
    ["a string", "12"],
    ["the empty string", ""],
    ["NaN", Number.NaN],
  ])("falls back to the default zoom for %s", (_case, zoom) => {
    expect(mapEmbedUrl("Moscow", zoom)).toContain("z=15");
    expect(mapEmbedUrl("Moscow", zoom)).not.toContain("NaN");
  });

  it("rounds a fractional zoom, so the query carries a level the provider accepts", () => {
    expect(mapEmbedUrl("Moscow", 12.6)).toContain("z=13");
  });

  it("trims the address before it goes into the query", () => {
    expect(mapEmbedUrl("  Moscow\n", 12)).toBe("https://maps.google.com/maps?q=Moscow&z=12&output=embed");
  });

  it("encodes a cyrillic address", () => {
    expect(mapEmbedUrl("Москва, Красная площадь 1", 15)).toBe(
      `https://maps.google.com/maps?q=${encodeURIComponent("Москва, Красная площадь 1")}&z=15&output=embed`,
    );
  });

  it("encodes an address that carries query syntax as a value", () => {
    expect(mapEmbedUrl("a&z=99#x", 12)).toContain("q=a%26z%3D99%23x");
  });
});

describe("mapLinkUrl", () => {
  it("points at the full maps page for the same query, so it stays keyless", () => {
    expect(mapLinkUrl("Tverskaya 1, Moscow")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Tverskaya%201%2C%20Moscow",
    );
  });

  it("trims the address", () => {
    expect(mapLinkUrl("  Moscow ")).toBe("https://www.google.com/maps/search/?api=1&query=Moscow");
  });
});
