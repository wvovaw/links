import type { EventSourceDto } from "./dto/event-source.dto";

/** The source of one event, as it is stored: the raw facts, never the label the dashboard prints. */
export interface SourceColumns {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
  referrerInternal: boolean;
}

const tagLimit = 100;
const hostLimit = 253;

export type HostMedium = "search" | "social" | "referral";

/** Search engines: a visitor who leaves one of these was looking for something and found the page. */
const searchHosts = new Set([
  "bing.com",
  "duckduckgo.com",
  "yandex.ru",
  "ya.ru",
  "search.yahoo.com",
  "yahoo.com",
  "baidu.com",
  "ecosia.org",
  "startpage.com",
  "brave.com",
]);

/** Networks: the link was shared in front of an audience rather than looked up. */
const socialHosts = new Set([
  "t.me",
  "telegram.me",
  "x.com",
  "twitter.com",
  "vk.com",
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "reddit.com",
  "pinterest.com",
  "tiktok.com",
  "youtube.com",
  "threads.net",
  "mastodon.social",
]);

/**
 * What a referring host means. `google` matches any of its country domains; everything not on a list is a
 * plain referral rather than a guess. This is read-time classification, so growing the lists relabels the
 * rows already stored.
 */
export function mediumOfHost(referrerHost: string): HostMedium {
  if (/^google\.[a-z.]+$/.test(referrerHost) || searchHosts.has(referrerHost)) return "search";
  if (socialHosts.has(referrerHost)) return "social";

  return "referral";
}

/**
 * Normalises what the page sent into what the table holds. Lowercasing and capping happen here rather than
 * in the DTO so one function covers both endpoints, and so the classification further down reads values it
 * already knows the shape of.
 */
export function toSourceColumns(dto: EventSourceDto): SourceColumns {
  return {
    utmSource: tag(dto.utmSource),
    utmMedium: tag(dto.utmMedium),
    utmCampaign: tag(dto.utmCampaign),
    referrerHost: host(dto.referrerHost),
    referrerInternal: dto.referrerInternal ?? false,
  };
}

/** An empty tag is an absent tag: `?utm_source=` says nothing, and must not become a label of its own. */
function tag(value?: string): string | null {
  const normalized = value?.trim().toLowerCase();

  return normalized ? normalized.slice(0, tagLimit) : null;
}

function host(value?: string): string | null {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/^www\./, "");

  return normalized ? normalized.slice(0, hostLimit) : null;
}
