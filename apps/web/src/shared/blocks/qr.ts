import { renderSVG } from "uqr";

export interface QrSvgOptions {
  size: number;
  foreground?: string;
  background?: string;
}

const DEFAULT_FOREGROUND = "#171515";
const DEFAULT_BACKGROUND = "#ffffff";

/**
 * The drawing is the library's own SVG, and the colours go through its own attribute escaping, so the
 * markup never carries anything the qr code did not generate. `renderSVG` leaves the root without a
 * display size — its `viewBox` is the module grid — so the requested size is written on the root and
 * the modules keep their square proportions. Nothing here reaches the network.
 */
export function qrSvg(value: string, options: QrSvgOptions): string {
  const svg = renderSVG(value, {
    blackColor: options.foreground ?? DEFAULT_FOREGROUND,
    whiteColor: options.background ?? DEFAULT_BACKGROUND,
  });

  return svg.replace("<svg ", `<svg width="${options.size}" height="${options.size}" `);
}
