/* Only a web address may reach `href`: `javascript:` and `data:` would run in the page's own origin. */
const WEB_SCHEME = /^https?:/i;

/**
 * The address a stored url property draws, or `null` for everything the page must not link to. The API
 * stores block JSON unvalidated and no CSP guards the public page, so a stored `javascript:` value in
 * an `href` would execute in the app's own origin when a visitor clicks it. Total on every input
 * because it runs while a public page renders.
 */
export function webHref(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return WEB_SCHEME.test(trimmed) ? trimmed : null;
}
