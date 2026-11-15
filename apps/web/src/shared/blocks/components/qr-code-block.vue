<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyColor,
  IBlockPropertyNumber,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

import { qrSvg } from "~shared/blocks/qr";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

/** A code stored without an address points at the page it sits on, which is the page's own URL. */
const pageUrl = useRequestURL().href;

const bp = computed(() => {
  const p = props.properties;
  const url = (p.url as IBlockPropertyUrl | undefined)?.value?.trim() || pageUrl;
  const caption = (p.caption as IBlockPropertyText | undefined)?.value?.trim() || null;

  return {
    /*
      The `v-html` below is safe only because this markup is generated locally by the qr library from
      the resolved value and the colours — it never comes from user HTML, and the block carries no
      property that holds markup at all.
    */
    svg: qrSvg(url, {
      size: (p.size as IBlockPropertyNumber | undefined)?.value ?? 160,
      /* An empty stored colour is no colour, so it falls back to the block's default in `qrSvg`. */
      foreground: (p.foreground as IBlockPropertyColor | undefined)?.value || undefined,
      background: (p.background as IBlockPropertyColor | undefined)?.value || undefined,
    }),
    caption,
    /* A code cannot be scanned by a screen reader, so the figure is named for it instead. */
    label: caption ?? "QR code",
  };
});
</script>

<template>
  <figure class="qr-code-block">
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
