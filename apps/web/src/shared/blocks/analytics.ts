export type BlockEventKind = "click" | "view";

export interface TrackBlockEventInput {
  slug: string;
  blockId: string;
  kind: BlockEventKind;
  /** The backend origin, e.g. `config.public.backendUrl`: a page is served from a different origin. */
  origin: string;
}

/**
 * Reports one event from a public page. A beacon is the transport because it outlives the navigation a
 * click starts, and it never throws: analytics may not cost a visitor the link they clicked.
 */
export function trackBlockEvent(input: TrackBlockEventInput): void {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") return;

  const body = new Blob([JSON.stringify({ blockId: input.blockId, kind: input.kind })], { type: "application/json" });

  try {
    navigator.sendBeacon(`${input.origin}/public/links/${input.slug}/events`, body);
  } catch {
    /* A refused beacon is not a page error. */
  }
}
