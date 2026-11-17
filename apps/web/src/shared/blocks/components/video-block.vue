<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyBoolean,
  IBlockPropertyNumber,
  IBlockPropertySelect,
  IBlockPropertyUrl,
} from "@links/blocks";
import type { VideoProvider } from "~shared/blocks/embed-urls";

import { clampNumber } from "~shared/blocks/clamp-number";
import { videoEmbedUrl } from "~shared/blocks/embed-urls";
import { i18nLabel } from "~shared/lib/i18n-label";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const i18n = useI18n();

/** The block's own English text stays the fallback, so a locale that lost the key never blanks a label. */
const frameTitle = computed(() => i18nLabel(i18n, "blocks.Video.frameTitle", "Video"));

const VIDEO_PROVIDERS = ["youtube", "vimeo", "tiktok"] as const;

const ASPECT_RATIOS = [
  { label: "16:9", css: "16 / 9" },
  { label: "9:16", css: "9 / 16" },
  { label: "1:1", css: "1 / 1" },
] as const;

/** Each player names its own mute flag; autoplay and loop are `1` on all three. */
const MUTE_FLAGS: Record<VideoProvider, string> = { youtube: "mute", vimeo: "muted", tiktok: "muted" };

/** The provider comes from stored data: anything outside the closed set plays as the youtube default. */
function videoProvider(value: string | undefined): VideoProvider {
  return VIDEO_PROVIDERS.find((provider) => provider === value) ?? "youtube";
}

function aspectRatio(value: string | undefined): string {
  return ASPECT_RATIOS.find((ratio) => ratio.label === value)?.css ?? "16 / 9";
}

/**
 * The embed address with the provider's own playback flags. Autoplay only ever starts muted — a
 * browser blocks a noisy one — so it carries the mute flag with it, and YouTube loops a single video
 * only through a playlist that names that video.
 */
function withPlaybackFlags(
  provider: VideoProvider,
  embedUrl: string,
  flags: { autoplay: boolean; muted: boolean; loop: boolean },
): string {
  const src = new URL(embedUrl);
  if (flags.autoplay) src.searchParams.set("autoplay", "1");
  if (flags.loop) src.searchParams.set("loop", "1");
  if (flags.muted || flags.autoplay) src.searchParams.set(MUTE_FLAGS[provider], "1");
  if (provider === "youtube" && flags.loop) src.searchParams.set("playlist", src.pathname.split("/").pop() ?? "");

  return src.toString();
}

const bp = computed(() => {
  const p = props.properties;
  const provider = videoProvider((p.provider as IBlockPropertySelect | undefined)?.value);
  const url = (p.url as IBlockPropertyUrl | undefined)?.value ?? "";
  const embed = videoEmbedUrl(provider, url);

  return {
    url,
    /*
      A plain iframe from the provider's own player: no vendor script, no `srcdoc`, nothing of the
      page's origin. A link the mapper cannot read has no iframe to point anywhere, so the block
      shows the stored link instead.
    */
    src:
      embed &&
      withPlaybackFlags(provider, embed, {
        autoplay: Boolean((p.autoplay as IBlockPropertyBoolean | undefined)?.value),
        muted: Boolean((p.muted as IBlockPropertyBoolean | undefined)?.value),
        loop: Boolean((p.loop as IBlockPropertyBoolean | undefined)?.value),
      }),
    vars: {
      "--video-aspect": aspectRatio((p.aspect as IBlockPropertySelect | undefined)?.value),
      "--video-radius": `${clampNumber((p.radius as IBlockPropertyNumber | undefined)?.value, 0, 32, 8)}px`,
    },
  };
});
</script>

<template>
  <div class="video-block" :style="bp.vars">
    <iframe
      v-if="bp.src"
      class="video-block__frame"
      :src="bp.src"
      :title="frameTitle"
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
    />
    <p v-else class="video-block__placeholder">{{ bp.url }}</p>
  </div>
</template>

<style>
.video-block {
  width: 100%;
}
.video-block__frame {
  display: block;
  width: 100%;
  aspect-ratio: var(--video-aspect, 16 / 9);
  border: 0;
  border-radius: var(--video-radius, 8px);
}
/* No embed to draw: the stored link stays on the page so its owner can see what is wrong with it. */
.video-block__placeholder {
  margin: 0;
  min-height: 2rem;
  padding: 0.75rem;
  border: 1px dashed var(--links-page-fg);
  border-radius: var(--video-radius, 8px);
  color: var(--links-page-fg);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}
</style>
