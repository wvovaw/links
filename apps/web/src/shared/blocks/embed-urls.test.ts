import { describe, expect, it } from "vitest";

import type { VideoProvider } from "./embed-urls";

import { videoEmbedUrl } from "./embed-urls";

describe("videoEmbedUrl", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
  ])("maps a youtube share link %s", (input, expected) => {
    expect(videoEmbedUrl("youtube", input)).toBe(expected);
  });

  it("maps vimeo and tiktok share links", () => {
    expect(videoEmbedUrl("vimeo", "https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
    expect(videoEmbedUrl("tiktok", "https://www.tiktok.com/@user/video/7312345678901234567")).toBe(
      "https://www.tiktok.com/player/v1/7312345678901234567",
    );
  });

  it.each([
    ["youtube", "https://example.com/watch?v=1"],
    ["youtube", "not a url"],
    ["vimeo", "https://vimeo.com/channels/staffpicks"],
    ["tiktok", "https://www.tiktok.com/@user"],
  ])("returns null for %s with %s", (provider, input) => {
    expect(videoEmbedUrl(provider as VideoProvider, input)).toBeNull();
  });

  it("returns null when the link belongs to another provider", () => {
    expect(videoEmbedUrl("vimeo", "https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });
});
