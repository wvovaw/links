import { describe, expect, it } from "vitest";

import { qrSvg } from "./qr";

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
});
