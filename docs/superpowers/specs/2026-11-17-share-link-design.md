# Sharing a page with tags

## What and why

The analytics reads `utm_*` tags, and the only way to produce a tagged link today is to type it by hand.
There is not even a plain "copy link" anywhere in the constructor: the actions row has Edit, Statistics,
Preview and Delete. So the gap is not the tags, it is sharing.

One button per page — **Share** in the actions row (`link-actions.vue`, desktop row and mobile menu) —
opens a dialog that builds the link for the channel the owner is about to post in:

- a row of channel presets: Telegram, Instagram, VK, E-mail, Partner, and "own tag";
- three inputs, prefilled by the preset and editable: `utm_source`, `utm_medium`, `utm_campaign`
  (the campaign one empty);
- the resulting URL, read-only, with **Copy**;
- the same URL as a QR code.

## Decisions

1. **Client-side only.** No table, no endpoint, no stored source list — a share is a URL built from
   `baseUrl + '/' + slug` and three query parameters. Option B (stored sources, renameable afterwards)
   stays a later step if owners start wanting consistent labels across pages.
2. **Presets carry `utm_medium` values the dashboard already knows** — `social`, `email`, `referral` — so
   what the owner picks is what the source table prints, instead of a free word that shows up raw.
3. **Nothing filled means nothing added.** An empty field is left out of the URL, so the default state of
   the dialog is the plain page link, which is also the thing the product was missing.
4. **The QR is the same URL**, drawn with the existing `qrSvg()` helper (`~shared/blocks/qr.ts`), which
   already refuses colours that are not colours and values that do not fit a code. Over-capacity → no QR,
   the URL is still there.
5. **Copy is `navigator.clipboard.writeText`**, wrapped: on failure the URL input is selected so the owner
   can copy by hand, and the dialog says so rather than pretending.
6. **`link-actions.vue` gains `slug`** — the list already holds it in the row loop.
7. **The mobile trigger is its own icon button beside the kebab**, not an item inside the menu: a menu item
   would have to close the menu and open a dialog from inside it, which is a second piece of state for one
   button. The compact trigger keeps its own closed dialog.
8. **i18n keys under `share.*` in both locales.** (The hardcoded English around it is a separate, existing
   debt; a new dialog has no excuse.)

## Non-goals

Stored/renameable sources, a source list per owner, custom domains, a short "?s=" redirect, attribution
windows, editing tags after the fact.

## Tests

- The URL builder as a pure function: no tags → the plain link; one field → only that parameter; values
  are encoded; a blank value is omitted.
- The dialog: a preset fills the fields and the URL follows; Copy writes the shown URL and reports it;
  clearing the source falls back to the plain link.
- `qrSvg` is already tested where it lives; the dialog test asserts the QR block renders for a normal URL
  and disappears when the helper returns `null`.
