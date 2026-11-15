export type VideoProvider = "youtube" | "vimeo" | "tiktok";
export type MusicProvider = "spotify" | "soundcloud" | "apple-music" | "youtube-music";

/* A pasted id is put into the embed path, so it must be shaped like an id and nothing else. */
const SAFE_ID = /^[\w-]+$/;
const NUMERIC_ID = /^\d+$/;

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com"]);
const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com"]);

interface VideoEmbed {
  /** Everything before the video id; the id is the whole of what a share link contributes. */
  readonly base: string;
  readonly videoId: (url: URL) => string | null;
}

function segments(url: URL): string[] {
  return url.pathname.split("/").filter(Boolean);
}

/** A share link is `youtu.be/<id>`, `/watch?v=<id>` or `/shorts/<id>`; a channel page carries no id. */
function youtubeVideoId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    const [id] = segments(url);
    return id && SAFE_ID.test(id) ? id : null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  const [first, second] = segments(url);
  if (first === "shorts") return second && SAFE_ID.test(second) ? second : null;

  const query = url.searchParams.get("v");
  return query && SAFE_ID.test(query) ? query : null;
}

/** A video is `vimeo.com/<id>`; a channel or a showcase is a word, which has no numeric first segment. */
function vimeoVideoId(url: URL): string | null {
  if (!VIMEO_HOSTS.has(url.hostname)) return null;

  const [id] = segments(url);
  return id && NUMERIC_ID.test(id) ? id : null;
}

/** A share link is `tiktok.com/@<user>/video/<id>`; a profile has no `video` segment to read past. */
function tiktokVideoId(url: URL): string | null {
  if (!TIKTOK_HOSTS.has(url.hostname)) return null;

  const path = segments(url);
  const marker = path.indexOf("video");
  const id = marker === -1 ? undefined : path[marker + 1];
  return id && NUMERIC_ID.test(id) ? id : null;
}

const VIDEO_EMBEDS: Record<VideoProvider, VideoEmbed> = {
  youtube: { base: "https://www.youtube.com/embed/", videoId: youtubeVideoId },
  vimeo: { base: "https://player.vimeo.com/video/", videoId: vimeoVideoId },
  tiktok: { base: "https://www.tiktok.com/player/v1/", videoId: tiktokVideoId },
};

/**
 * The iframe address a provider serves for a pasted share link, or `null` for everything the helper
 * cannot map: an unparseable url, another site's page, or a link of another provider (the owner picks
 * the provider, so a mismatch is a mistake to show rather than to guess around). Total on every input
 * because it runs while a public page renders — a stored block must never throw the page away.
 */
export function videoEmbedUrl(provider: VideoProvider, url: string): string | null {
  const embed: VideoEmbed | undefined = VIDEO_EMBEDS[provider];
  if (!embed) return null;

  const parsed = parseUrl(url);
  if (!parsed) return null;

  const id = embed.videoId(parsed);
  return id ? embed.base + id : null;
}

function parseUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/** Spotify serves a player for these content kinds; an artist or a user page has no player to embed. */
const SPOTIFY_KINDS = new Set(["track", "album", "playlist", "episode", "show"]);
const SOUNDCLOUD_HOSTS = new Set(["soundcloud.com", "on.soundcloud.com"]);

function spotifyEmbedUrl(url: URL): string | null {
  if (url.hostname !== "open.spotify.com") return null;

  const [kind, id] = segments(url);
  if (!kind || !id || !SPOTIFY_KINDS.has(kind) || !SAFE_ID.test(id)) return null;

  return `https://open.spotify.com/embed/${kind}/${id}`;
}

/** SoundCloud's player takes the page address whole, as a parameter rather than as a path. */
function soundcloudEmbedUrl(url: URL): string | null {
  if (!SOUNDCLOUD_HOSTS.has(url.hostname)) return null;

  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}`;
}

/** Apple Music serves the same catalogue from an embed host; the region and the item stay in the path. */
function appleMusicEmbedUrl(url: URL): string | null {
  if (url.hostname !== "music.apple.com") return null;

  return `https://embed.music.apple.com${url.pathname}`;
}

/** YouTube Music plays through YouTube's own player: the same video id behind a different front door. */
function youtubeMusicEmbedUrl(url: URL): string | null {
  if (url.hostname !== "music.youtube.com") return null;

  const asYouTube = new URL(url);
  asYouTube.hostname = "www.youtube.com";
  return videoEmbedUrl("youtube", asYouTube.href);
}

const MUSIC_EMBEDS: Record<MusicProvider, (url: URL) => string | null> = {
  "spotify": spotifyEmbedUrl,
  "soundcloud": soundcloudEmbedUrl,
  "apple-music": appleMusicEmbedUrl,
  "youtube-music": youtubeMusicEmbedUrl,
};

/**
 * The iframe address a streaming provider serves for a pasted share link, or `null` for everything the
 * helper cannot map: an unparseable url, another site's page, or a link of another provider. Total on
 * every input for the same reason as `videoEmbedUrl` — a stored block must never throw the page away.
 */
export function musicEmbedUrl(provider: MusicProvider, url: string): string | null {
  const embed: ((url: URL) => string | null) | undefined = MUSIC_EMBEDS[provider];
  if (!embed) return null;

  const parsed = parseUrl(url);
  return parsed ? embed(parsed) : null;
}
