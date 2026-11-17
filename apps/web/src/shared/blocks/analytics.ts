export type BlockEventKind = "click" | "view";

/** Where a visit came from, as far as the page itself can tell. */
export interface EventSource {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** The external host the visitor left, or nothing for a direct visit. */
  referrerHost?: string;
  /** The visitor moved between our own pages: a real visit, but not one this page acquired. */
  referrerInternal?: boolean;
}

export interface TrackBlockEventInput {
  slug: string;
  blockId: string;
  kind: BlockEventKind;
  /** The backend origin, e.g. `config.public.backendUrl`: a page is served from a different origin. */
  origin: string;
}

const tagLimit = 100;
const hostLimit = 253;

/**
 * Reads the traffic source off the document.
 *
 * The beacon is cross-origin, so the browser's own `Referer` header carries our page rather than the site
 * the visitor left — this function is the only place the real referrer can be read, and it has to travel in
 * the body to arrive at all. It reads the document on every call instead of caching: within one page the
 * address and the referrer cannot change, and a cache would be state that outlives the test which set it.
 */
export function readSource(): EventSource {
  if (typeof document === "undefined" || typeof location === "undefined") return {};

  const source: EventSource = {};
  const address = new URLSearchParams(location.search);

  const tags = [
    ["utmSource", "utm_source"],
    ["utmMedium", "utm_medium"],
    ["utmCampaign", "utm_campaign"],
  ] as const;

  for (const [field, parameter] of tags) {
    /* An empty `?utm_source=` is an absent tag: it says nothing and must not become a label of its own. */
    const tag = address.get(parameter)?.trim().toLowerCase();

    if (tag) source[field] = tag.slice(0, tagLimit);
  }

  sourceReferrer(source);

  return source;
}

/** One page visit per document, reported once the page is in front of the visitor. */
export function trackPageView(input: { slug: string; origin: string }): void {
  send(`/public/links/${input.slug}/views`, input.origin, readSource());
}

/**
 * Reports one click. It carries the same source the view did: a page is one document, so the source cannot
 * change between the two, and giving each event its own copy keeps "clicks by source" a plain grouped read.
 */
export function trackBlockEvent(input: TrackBlockEventInput): void {
  send(`/public/links/${input.slug}/events`, input.origin, {
    blockId: input.blockId,
    kind: input.kind,
    ...readSource(),
  });
}

/**
 * One transport for both events. A beacon is the transport because it outlives the navigation a click
 * starts, and it never throws: analytics may not cost a visitor the link they clicked.
 */
function send(path: string, origin: string, body: object): void {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return;

  const payload = new Blob([JSON.stringify(body)], { type: "application/json" });

  try {
    navigator.sendBeacon(`${origin}${path}`, payload);
  } catch {
    /* A refused beacon is not a page error. */
  }
}

/** Fills `referrerHost` or `referrerInternal` from `document.referrer`, if the browser holds one. */
function sourceReferrer(source: EventSource): void {
  if (!document.referrer) return;

  try {
    const referrer = new URL(document.referrer);

    if (referrer.origin === location.origin) {
      source.referrerInternal = true;

      return;
    }

    source.referrerHost = referrer.hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .slice(0, hostLimit);
  } catch {
    /* An address the browser wrote but we cannot parse is no referrer at all. */
  }
}
