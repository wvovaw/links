# Plan: sharing a page with tags

Spec: `docs/superpowers/specs/2026-11-17-share-link-design.md`.
Everything lands in `apps/web`. No backend change, no new dependency (`uqr` is already here).

## Task 1 — the URL builder

`apps/web/src/widgets/link-share/model/tagged-url.ts`

```ts
taggedUrl({ base, slug, source?, medium?, campaign? }): string
```

Plain page link when every tag is blank; otherwise `?utm_source=…&utm_medium=…&utm_campaign=…` in that
order, only for the fields that have a value, trimmed and URL-encoded. Base may carry a trailing slash.

Tests (`tagged-url.test.ts`): no tags → plain link; one tag → one parameter; blanks and whitespace are
omitted; values with `&`/spaces are encoded; a trailing slash on the base does not double up.

## Task 2 — the channel presets

`apps/web/src/widgets/link-share/model/channels.ts` — a constant list `{ id, source, medium, icon }`:
Telegram/Instagram/VK (`social`), E-mail (`newsletter`/`email`), Partner (`referral`), Custom (empty).
Test: every preset's medium is one the backend classifies (`social`, `email`, `referral`) or empty, so a
preset can never print a raw word in the source table.

## Task 3 — i18n

`share.*` keys in `en-US.ts` and `ru-RU.ts`: title, subtitle, the six channel labels, the three field
labels and placeholders, `copy`, `copied`, `copyManually`, `qr.title`, `close`. Test: both locales carry
the same `share.*` key set.

## Task 4 — the dialog

`apps/web/src/widgets/link-share/ui/share-link-dialog.vue`

- trigger `UIButton` (prop `compact` renders it icon-only for the mobile bar);
- `UIDialog.Root` + Header/Title/Subtitle; the channel row as `UIButton size="xs" variant="outline"`
  with an icon, the active one highlighted when `source`/`medium` match it;
- three `UIInput`s bound to `source`, `medium`, `campaign`;
- the URL, read-only, plus **Copy**; `navigator.clipboard.writeText`, and on failure the input is
  selected and the dialog says to copy by hand;
- the QR block through `qrSvg()` (`v-html`, already sanitised there) — `null` hides it.

Tests: a preset fills both fields and the URL; typing a source that is not a preset clears the highlight;
Copy writes the shown URL and flips the label to "copied"; a failed Copy selects the input and shows the
manual hint; clearing all fields returns the plain link; a URL too long for a QR renders no QR.

## Task 5 — wire it in and verify

`link-actions.vue` gains a `slug` prop (the row loop already has it) and renders the widget in the desktop
row and, compact, in the mobile bar. `pnpm verify`, then a browser pass: open the page list, click Share,
pick Telegram, read the URL, copy, check the clipboard text, count the QR modules, close.
