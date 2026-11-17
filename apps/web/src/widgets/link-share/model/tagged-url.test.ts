import { describe, expect, it } from "vitest";

import { taggedUrl } from "./tagged-url";

const base = "https://links.example";

describe("taggedUrl", () => {
  /* The dialog opens on the thing the product was missing: the page's own address, no questions asked. */
  it("gives the plain page link when nothing is filled", () => {
    expect(taggedUrl({ base, slug: "my-page" })).toBe("https://links.example/my-page");
  });

  it("adds only the tags that were filled", () => {
    expect(taggedUrl({ base, slug: "my-page", source: "telegram" })).toBe(
      "https://links.example/my-page?utm_source=telegram",
    );
    expect(taggedUrl({ base, slug: "my-page", source: "telegram", medium: "social" })).toBe(
      "https://links.example/my-page?utm_source=telegram&utm_medium=social",
    );
  });

  it("keeps the tags in the order the dialog prints them", () => {
    expect(taggedUrl({ base, slug: "my-page", source: "telegram", medium: "social", campaign: "november" })).toBe(
      "https://links.example/my-page?utm_source=telegram&utm_medium=social&utm_campaign=november",
    );
  });

  /* An empty field is an absent field: `?utm_source=` would be a label of its own in the source table. */
  it("drops blanks and whitespace", () => {
    expect(taggedUrl({ base, slug: "my-page", source: "   ", medium: "", campaign: "\t" })).toBe(
      "https://links.example/my-page",
    );
    expect(taggedUrl({ base, slug: "my-page", source: "  vk  ", medium: " social " })).toBe(
      "https://links.example/my-page?utm_source=vk&utm_medium=social",
    );
  });

  it("encodes a value that would otherwise break the query", () => {
    expect(taggedUrl({ base, slug: "my-page", source: "a&b c" })).toBe(
      "https://links.example/my-page?utm_source=a%26b+c",
    );
  });

  it("does not double the slash on a base that ends with one", () => {
    expect(taggedUrl({ base: "https://links.example/", slug: "my-page" })).toBe("https://links.example/my-page");
  });
});
