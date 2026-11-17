<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyColor,
  IBlockPropertyNumber,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

import { pageAddress, qrSvg } from "~shared/blocks/qr";
import { i18nLabel } from "~shared/lib/i18n-label";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const i18n = useI18n();

/** The figure's own English name stays the fallback, so a locale that lost the key never blanks it. */
const codeLabel = computed(() => i18nLabel(i18n, "blocks.QrCode.code", "QR code"));

const SIZE_MIN = 80;
const SIZE_MAX = 320;
const DEFAULT_SIZE = 160;

/**
 * The schema offers 80–320, but the API stores block JSON unvalidated, so a stored value is clamped
 * here and a value that is not a number at all falls back to the default size.
 */
function blockSize(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(SIZE_MAX, Math.max(SIZE_MIN, value));
}

/** Stored JSON is unvalidated, so a value that is not a string is not a text either. */
function storedText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** A code stored without an address points at the page it sits on, which is the page's own URL. */
const pageUrl = pageAddress(useRequestURL());

const bp = computed(() => {
  const p = props.properties;
  const url = storedText((p.url as IBlockPropertyUrl | undefined)?.value) || pageUrl;
  const caption = storedText((p.caption as IBlockPropertyText | undefined)?.value) || null;
  const svg = qrSvg(url, {
    size: blockSize((p.size as IBlockPropertyNumber | undefined)?.value),
    foreground: (p.foreground as IBlockPropertyColor | undefined)?.value,
    background: (p.background as IBlockPropertyColor | undefined)?.value,
  });

  return {
    /*
      The `v-html` below is safe only because this markup is generated locally by the qr library from
      the resolved value — it never comes from user HTML, the colours are checked against a colour
      grammar and the size is a finite number, so nothing of the block's own JSON reaches the markup
      unescaped. The block carries no property that holds markup at all.
    */
    svg,
    caption,
    /* A code cannot be scanned by a screen reader, so the figure is named for it instead. */
    label: caption ?? codeLabel.value,
  };
});
</script>

<template>
  <figure v-if="bp.svg" class="qr-code-block">
    <div v-html="bp.svg" class="qr-code-block__code" role="img" :aria-label="bp.label" />
    <figcaption v-if="bp.caption" class="qr-code-block__caption">{{ bp.caption }}</figcaption>
  </figure>
</template>

<style>
.qr-code-block {
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
  width: 100%;
  margin: 0;
}
/* The wrapper keeps the code's own background inside the page's rounded corner. */
.qr-code-block__code {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--links-page-radius, 8px);
  line-height: 0;
}
.qr-code-block__code > svg {
  display: block;
  max-width: 100%;
  height: auto;
}
.qr-code-block__caption {
  margin: 0;
  color: var(--links-page-fg);
  font-size: 0.8rem;
  text-align: center;
}
</style>
