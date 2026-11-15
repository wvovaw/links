/** The zoom range Google's embed accepts; a stored level outside it is clamped, never forwarded raw. */
const MIN_ZOOM = 1;
const MAX_ZOOM = 20;

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/**
 * The iframe address Google serves for an address with no API key, or `null` when the address carries
 * nothing to look up. The address is the `q` value whole, so it is encoded as a query value and an
 * ampersand inside it cannot become another parameter. Total on every input because it runs while a
 * public page renders — a stored block must never throw the page away.
 */
export function mapEmbedUrl(address: string, zoom: number): string | null {
  const query = address.trim();
  if (!query) return null;

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${clampZoom(zoom)}&output=embed`;
}

/**
 * The same lookup opened in the full maps UI. `search/?api=1` is Google's documented keyless deep
 * link, so the block's link needs no key either and lands on a page a visitor can zoom and pan.
 */
export function mapLinkUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}
