import { describe, expect, it } from "vitest";

import type { MusicProvider, VideoProvider } from "./embed-urls";

import { musicEmbedUrl, videoEmbedUrl } from "./embed-urls";

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

describe("musicEmbedUrl", () => {
  it("maps spotify kinds to the embed path", () => {
    expect(musicEmbedUrl("spotify", "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT")).toBe(
      "https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT",
    );
    expect(musicEmbedUrl("spotify", "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc")).toBe(
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    );
  });

  it("maps soundcloud and apple music", () => {
    expect(musicEmbedUrl("soundcloud", "https://soundcloud.com/artist/track")).toBe(
      "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://soundcloud.com/artist/track"),
    );
    expect(musicEmbedUrl("apple-music", "https://music.apple.com/us/album/x/1234567890")).toBe(
      "https://embed.music.apple.com/us/album/x/1234567890",
    );
  });

  it("maps a youtube music link through the video mapper", () => {
    expect(musicEmbedUrl("youtube-music", "https://music.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
  });

  it("returns null for a spotify artist page and for junk", () => {
    expect(musicEmbedUrl("spotify", "https://open.spotify.com/artist/abc")).toBeNull();
    expect(musicEmbedUrl("soundcloud", "https://example.com/x")).toBeNull();
  });

  it.each([
    [
      "https://open.spotify.com/album/4cOdK2wGLETKBW3PvgPWqT",
      "spotify",
      "https://open.spotify.com/embed/album/4cOdK2wGLETKBW3PvgPWqT",
    ],
    [
      "https://open.spotify.com/episode/4cOdK2wGLETKBW3PvgPWqT",
      "spotify",
      "https://open.spotify.com/embed/episode/4cOdK2wGLETKBW3PvgPWqT",
    ],
    [
      "https://open.spotify.com/show/4cOdK2wGLETKBW3PvgPWqT",
      "spotify",
      "https://open.spotify.com/embed/show/4cOdK2wGLETKBW3PvgPWqT",
    ],
    [
      "https://on.soundcloud.com/abc123",
      "soundcloud",
      "https://w.soundcloud.com/player/?url=" + encodeURIComponent("https://on.soundcloud.com/abc123"),
    ],
    [
      "https://music.apple.com/us/album/the-dark-side-of-the-moon/1234567890?i=1234567891",
      "apple-music",
      "https://embed.music.apple.com/us/album/the-dark-side-of-the-moon/1234567890?i=1234567891",
    ],
    [
      "https://music.apple.com/us/song/yesterday/1234567891",
      "apple-music",
      "https://embed.music.apple.com/us/song/yesterday/1234567891",
    ],
    [
      "https://music.apple.com/gb/playlist/all-time-hits/pl.u-abc123xyz",
      "apple-music",
      "https://embed.music.apple.com/gb/playlist/all-time-hits/pl.u-abc123xyz",
    ],
    [
      "https://music.apple.com/us/music-video/one-more-time/1234567890",
      "apple-music",
      "https://embed.music.apple.com/us/music-video/one-more-time/1234567890",
    ],
  ])("maps %s as %s", (input, provider, expected) => {
    expect(musicEmbedUrl(provider as MusicProvider, input)).toBe(expected);
  });

  it.each([
    ["spotify", "https://open.spotify.com/artist/abc"],
    ["spotify", "https://open.spotify.com/user/someone"],
    ["spotify", "not a url"],
    ["soundcloud", "https://example.com/x"],
    ["apple-music", "https://example.com/us/album/x/1234567890"],
    ["apple-music", "https://music.apple.com/"],
    ["apple-music", "https://music.apple.com/us/artist/artist-name/1234567890"],
    ["apple-music", "https://music.apple.com/us/curator/curator-name/1234567890"],
    ["apple-music", "https://music.apple.com/us/album/album-name"],
    ["apple-music", "https://music.apple.com/us/album/album-name/1234%2A5678"],
    ["youtube-music", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    ["youtube-music", "https://music.youtube.com/channel/UC123"],
  ])("returns null for %s with %s", (provider, input) => {
    expect(musicEmbedUrl(provider as MusicProvider, input)).toBeNull();
  });
});
