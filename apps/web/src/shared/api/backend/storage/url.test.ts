import { describe, expect, it } from "vitest";

import { resolveAssetUrl } from "./url";

describe("asset urls", () => {
  it("resolves a stored asset against the asset endpoint", () => {
    expect(resolveAssetUrl("file-1.mp4", { origin: "https://api.example" })).toBe(
      "https://api.example/storage/assets/file-1.mp4",
    );
  });

  it("has no url for a value that names no file", () => {
    expect(resolveAssetUrl(undefined, { origin: "https://api.example" })).toBeUndefined();
  });
});
