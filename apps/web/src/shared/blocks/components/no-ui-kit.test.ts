import { describe, expect, it } from "vitest";

/**
 * The public page is not the constructor: its look comes from the page theme's own CSS variables, never
 * from `@links/ui`, whose components and UnoCSS preset carry the application's palette. A component that
 * reached for either would render the constructor's chrome on a visitor's page, so the rule is checked
 * against the source of every Vue component under this directory — renderers and their controls alike.
 */
const BLOCK_SOURCES = import.meta.glob("./**/*.vue", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/* The UI kit's palette tokens, as UnoCSS utilities (`text-chichi`, `bg-goku`, `border-beerus`, …). */
const UI_KIT_COLOUR =
  /\b(?:text|bg|border|ring|from|to|via)-(?:piccolo|jiren|hit|jira|beerus|gohan|goten|goku|bulma|trunks|popo|heles|zeno|krillin|chichi|roshi|dodoria|cell|raditz|whis|frieza|nappa)\b/;

describe("public block components", () => {
  it("finds the components to check", () => {
    expect(Object.keys(BLOCK_SOURCES).length).toBeGreaterThan(0);
  });

  it("never import the constructor's UI kit", () => {
    const offenders = Object.entries(BLOCK_SOURCES)
      .filter(([, source]) => source.includes("@links/ui"))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });

  it("never paint with the UI kit's palette", () => {
    const offenders = Object.entries(BLOCK_SOURCES)
      .filter(([, source]) => UI_KIT_COLOUR.test(source))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });
});
