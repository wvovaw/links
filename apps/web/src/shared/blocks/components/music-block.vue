<script setup lang="ts">
import type { BlockProperty, IBlockPropertySelect, IBlockPropertyUrl } from "@links/blocks";
import type { MusicProvider } from "~shared/blocks/embed-urls";

import { musicEmbedUrl } from "~shared/blocks/embed-urls";
import { i18nLabel } from "~shared/lib/i18n-label";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const i18n = useI18n();

/** The block's own English text stays the fallback, so a locale that lost the key never blanks a label. */
const frameTitle = computed(() => i18nLabel(i18n, "blocks.Music.frameTitle", "Music"));

const MUSIC_PROVIDERS = ["spotify", "soundcloud", "apple-music", "youtube-music"] as const;

const HEIGHTS = [
  { label: "compact", css: "152px" },
  { label: "full", css: "352px" },
] as const;

/** The provider comes from stored data: anything outside the closed set plays as the spotify default. */
function musicProvider(value: string | undefined): MusicProvider {
  return MUSIC_PROVIDERS.find((provider) => provider === value) ?? "spotify";
}

function blockHeight(value: string | undefined): string {
  return HEIGHTS.find((height) => height.label === value)?.css ?? "152px";
}

const bp = computed(() => {
  const p = props.properties;
  const provider = musicProvider((p.provider as IBlockPropertySelect | undefined)?.value);
  const url = (p.url as IBlockPropertyUrl | undefined)?.value ?? "";

  return {
    url,
    /*
      A plain iframe from the provider's own player: no vendor script, no `srcdoc`, nothing of the
      page's origin. A link the mapper cannot read has no iframe to point anywhere, so the block
      shows the stored link instead.
    */
    src: musicEmbedUrl(provider, url),
    vars: {
      "--music-height": blockHeight((p.height as IBlockPropertySelect | undefined)?.value),
    },
  };
});
</script>

<template>
  <div class="music-block" :style="bp.vars">
    <iframe
      v-if="bp.src"
      class="music-block__frame"
      :src="bp.src"
      :title="frameTitle"
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
    />
    <p v-else class="music-block__placeholder">{{ bp.url }}</p>
  </div>
</template>

<style>
.music-block {
  width: 100%;
}
.music-block__frame {
  display: block;
  width: 100%;
  height: var(--music-height, 152px);
  border: 0;
  border-radius: 8px;
}
/* No embed to draw: the stored link stays on the page so its owner can see what is wrong with it. */
.music-block__placeholder {
  margin: 0;
  min-height: 2rem;
  padding: 0.75rem;
  border: 1px dashed var(--links-page-fg);
  border-radius: 8px;
  color: var(--links-page-fg);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}
</style>
