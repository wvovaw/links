<script setup lang="ts">
import type { BlockProperty, IBlockPropertyBoolean, IBlockPropertyNumber, IBlockPropertyText } from "@links/blocks";

import { clampNumber } from "~shared/blocks/clamp-number";
import { mapEmbedUrl, mapLinkUrl } from "~shared/blocks/map-url";
import { i18nLabel } from "~shared/lib/i18n-label";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const i18n = useI18n();

/** The block's own English text stays the fallback, so a locale that lost the key never blanks a label. */
const openInMaps = computed(() => i18nLabel(i18n, "blocks.Map.openInMaps", "Open in maps"));
const frameTitle = computed(() => i18nLabel(i18n, "blocks.Map.frameTitle", "Map"));

const bp = computed(() => {
  const p = props.properties;
  const address = (p.address as IBlockPropertyText | undefined)?.value ?? "";

  return {
    address,
    /*
      A plain iframe from Google's keyless embed: no vendor script, no `srcdoc`, nothing of the page's
      origin. An address the mapper cannot read has no map to point anywhere, so the block renders
      nothing rather than a broken frame.
    */
    src: mapEmbedUrl(address, (p.zoom as IBlockPropertyNumber | undefined)?.value),
    /* A caption of only whitespace is no caption, and it would leave the iframe with an empty title. */
    caption: (p.caption as IBlockPropertyText | undefined)?.value?.trim() || null,
    showLink: (p["show-link"] as IBlockPropertyBoolean | undefined)?.value ?? true,
    href: mapLinkUrl(address),
    vars: {
      "--map-height": `${clampNumber((p.height as IBlockPropertyNumber | undefined)?.value, 120, 400, 240)}px`,
    },
  };
});
</script>

<template>
  <div v-if="bp.src" class="map-block" :style="bp.vars">
    <iframe class="map-block__frame" :src="bp.src" :title="bp.caption ?? frameTitle" loading="lazy" />
    <p v-if="bp.caption" class="map-block__caption">{{ bp.caption }}</p>
    <a v-if="bp.showLink" class="map-block__link" :href="bp.href" target="_blank" rel="noopener noreferrer">
      {{ openInMaps }}
    </a>
  </div>
</template>

<style>
.map-block {
  width: 100%;
}
.map-block__frame {
  display: block;
  width: 100%;
  height: var(--map-height, 240px);
  border: 0;
  border-radius: 8px;
}
.map-block__caption {
  margin: 0.5rem 0 0;
  color: var(--links-page-fg);
  font-size: 0.8rem;
}
.map-block__link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--links-page-accent);
  font-size: 0.85rem;
}
</style>
