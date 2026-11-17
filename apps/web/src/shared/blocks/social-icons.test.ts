import { describe, expect, it } from "vitest";

import { SOCIAL_SLOTS, socialHref } from "./social-icons";

function slotOf(key: string) {
  const slot = SOCIAL_SLOTS.find((candidate) => candidate.key === key);
  if (!slot) throw new Error(`no slot named ${key}`);
  return slot;
}

describe("SOCIAL_SLOTS", () => {
  it("lists the eight slots in the order they render", () => {
    expect(SOCIAL_SLOTS.map((slot) => slot.key)).toEqual([
      "telegram",
      "instagram",
      "youtube",
      "tiktok",
      "x",
      "vk",
      "whatsapp",
      "email",
    ]);
  });

  it("draws every slot from a simple icon, except the email one", () => {
    for (const slot of SOCIAL_SLOTS) expect(slot.icon).toMatch(/^i-(simple-icons|lucide):/);
    expect(slotOf("email").icon).toBe("i-lucide:mail");
  });
});

describe("socialHref", () => {
  it("builds a mailto href for the email slot and an https href for the rest", () => {
    expect(socialHref(slotOf("email"), "me@example.com")).toBe("mailto:me@example.com");
    expect(socialHref(slotOf("telegram"), "https://t.me/me")).toBe("https://t.me/me");
  });

  it("returns null for empty and whitespace values", () => {
    const slot = SOCIAL_SLOTS[0]!;
    expect(socialHref(slot, "")).toBeNull();
    expect(socialHref(slot, "   ")).toBeNull();
    expect(socialHref(slot, null)).toBeNull();
    expect(socialHref(slot, undefined)).toBeNull();
  });

  it("trims the value a slot was given", () => {
    expect(socialHref(slotOf("instagram"), "  https://instagram.com/me  ")).toBe("https://instagram.com/me");
  });

  it.each([
    ["telegram", "t.me/me", "https://t.me/me"],
    ["vk", "vk.com/me", "https://vk.com/me"],
    ["whatsapp", "wa.me/79990000000", "https://wa.me/79990000000"],
  ])("prefixes the %s slot when the value has no scheme", (key, value, expected) => {
    expect(socialHref(slotOf(key), value)).toBe(expected);
  });

  it.each([
    ["telegram", "http://t.me/me"],
    ["x", "https://x.com/me"],
    ["email", "mailto:me@example.com"],
  ])("keeps the %s value's own scheme instead of prefixing it twice", (key, value) => {
    expect(socialHref(slotOf(key), value)).toBe(value);
  });

  /*
    The field is free text and the API stores the block JSON unvalidated, so a stored `javascript:`
    value would run in the page's own origin the moment a visitor clicked the icon.
  */
  it.each([
    ["javascript:alert(1)"],
    ["data:text/html,<script>alert(1)</script>"],
    ["vbscript:msgbox(1)"],
    ["JavaScript:alert(1)"],
  ])("drops the value %s instead of drawing it as an href", (value) => {
    for (const key of ["telegram", "instagram", "x", "email"]) expect(socialHref(slotOf(key), value)).toBeNull();
  });

  /* `//evil.example` names no scheme but is still another origin, so it never gets a slot's prefix. */
  it("drops a protocol-relative value instead of prefixing it", () => {
    for (const key of ["telegram", "email"]) expect(socialHref(slotOf(key), "//evil.example/x")).toBeNull();
  });

  it("drops a scheme the slot does not carry, such as a mailto in a network slot", () => {
    expect(socialHref(slotOf("telegram"), "mailto:me@example.com")).toBeNull();
    expect(socialHref(slotOf("email"), "https://example.com/me")).toBeNull();
  });

  it.each([
    ["an empty string", ""],
    ["a number", 42],
  ])("returns null for %s", (_case, value) => {
    expect(socialHref(SOCIAL_SLOTS[0]!, value)).toBeNull();
  });
});

describe("the uno safelist", () => {
  /* A slot icon outside the safelist draws an empty box with no error anywhere, so it is pinned here. */
  it("carries every slot icon", async () => {
    const { default: unoConfig } = await import("../../../uno.config");
    const safelist = unoConfig.safelist as string[];

    for (const slot of SOCIAL_SLOTS) expect(safelist).toContain(slot.icon);
  });
});
