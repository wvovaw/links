import { renderSVG } from "uqr";

export interface QrSvgOptions {
  size: number;
  foreground?: string;
  background?: string;
}

const DEFAULT_SIZE = 160;
const DEFAULT_FOREGROUND = "#171515";
const DEFAULT_BACKGROUND = "#ffffff";

/** The colour forms a block can legitimately store: hex, or a numeric `rgb()`/`hsl()`. */
const HEX_COLOUR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTIONAL_COLOUR = /^(?:rgb|hsl)a?\(\s*[0-9.,%\s/+-]+\)$/i;

/**
 * The size is written into the root *after* the library has escaped its own markup, so it is only ever
 * written as a finite number. A stored value that is not one — a string from block JSON the API does
 * not validate, `NaN`, `Infinity` — becomes the default size instead of text that could close the
 * attribute and add its own.
 */
function safeSize(size: unknown): number {
  return typeof size === "number" && Number.isFinite(size) ? size : DEFAULT_SIZE;
}

/**
 * The library escapes a colour as an attribute but does not check that it is one, so a `url(...)` would
 * survive into `fill` as a paint server and make the page fetch a third-party document. Only a real
 * colour form is passed on; anything else — a reference, a keyword this grammar does not cover, an
 * empty value — falls back to the block's default.
 */
function safeColour(colour: unknown, fallback: string): string {
  const value = typeof colour === "string" ? colour.trim() : "";
  return HEX_COLOUR.test(value) || FUNCTIONAL_COLOUR.test(value) ? value : fallback;
}

/**
 * The page's own address for a code stored without one. A fragment exists only in the browser, so it is
 * dropped here: the code means "this page", not "this scroll position", and stripping it is also what
 * makes the server-rendered drawing and the hydrated one identical.
 */
export function pageAddress(url: URL): string {
  const address = new URL(url.href);
  address.hash = "";
  return address.href;
}

/**
 * The drawing is the library's own SVG, and both colours go through the checks above, so the markup
 * never carries anything the qr code did not generate. `renderSVG` leaves the root without a display
 * size — its `viewBox` is the module grid — so the requested size is written on the root and the
 * modules keep their square proportions. Nothing here reaches the network.
 *
 * `null` means the value does not fit a qr code at all: the library throws over capacity, and a block
 * that cannot be drawn must not take the page down with it.
 */
export function qrSvg(value: string, options: QrSvgOptions): string | null {
  const size = safeSize(options.size);

  let svg: string;
  try {
    svg = renderSVG(value, {
      blackColor: safeColour(options.foreground, DEFAULT_FOREGROUND),
      whiteColor: safeColour(options.background, DEFAULT_BACKGROUND),
    });
  } catch {
    return null;
  }

  return svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
}
