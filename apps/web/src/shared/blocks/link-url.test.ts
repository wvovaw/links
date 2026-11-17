import { describe, expect, it } from "vitest";

import { webHref } from "./link-url";

describe("webHref", () => {
  it("keeps an http and an https address", () => {
    expect(webHref("http://example.com/me")).toBe("http://example.com/me");
    expect(webHref("https://example.com/me")).toBe("https://example.com/me");
  });

  it("trims the value", () => {
    expect(webHref("  https://example.com/me  ")).toBe("https://example.com/me");
  });

  it.each([
    ["javascript:", "javascript:alert(1)"],
    ["data:", "data:text/html,<script>alert(1)</script>"],
    ["vbscript:", "vbscript:msgbox(1)"],
    ["mailto:", "mailto:me@example.com"],
    ["no scheme", "example.com/me"],
  ])("drops a value with %s", (_case, value) => {
    expect(webHref(value)).toBeNull();
  });

  it.each([
    ["an empty string", ""],
    ["null", null],
    ["a number", 42],
  ])("returns null for %s", (_case, value) => {
    expect(webHref(value)).toBeNull();
  });
});
