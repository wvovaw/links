<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyImage,
  IBlockPropertyNumber,
  IBlockPropertySelect,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

import { StorageApi } from "~shared/api/backend";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const bp = computed(() => {
  const p = props.properties;
  const radius = (p.radius as IBlockPropertyNumber | undefined)?.value;

  return {
    image:
      StorageApi.resolveImageUrl((p.image as IBlockPropertyImage | undefined)?.value, {
        origin: config.public.backendUrl,
      }) ?? "",
    /* A picture stored before these properties existed is decorative, lazy and cropped the same way. */
    alt: (p.alt as IBlockPropertyText | undefined)?.value ?? "",
    loading: (p.loading as IBlockPropertySelect | undefined)?.value ?? "lazy",
    link: (p.link as IBlockPropertyUrl | undefined)?.value,
    style: {
      "--picture-object-fit": (p["object-fit"] as IBlockPropertySelect | undefined)?.value ?? "cover",
      "--picture-radius": radius === undefined ? "var(--links-theme-picture-radius)" : `${radius}px`,
    },
  };
});
</script>

<template>
  <div class="picture-block" :style="bp.style">
    <component
      :is="bp.link ? 'a' : 'div'"
      class="picture-block__media"
      :href="bp.link || undefined"
      :rel="bp.link ? 'noopener noreferrer' : undefined"
    >
      <img class="picture-block__image" :src="bp.image" :alt="bp.alt" :loading="bp.loading" />
    </component>
  </div>
</template>

<style>
.picture-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
}
.picture-block__media {
  display: block;
  width: 100%;
  line-height: 0;
}
/* The box is reserved before the image lands, so the page below it does not jump on load. */
.picture-block__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: var(--picture-object-fit, cover);
  border-radius: var(--picture-radius, var(--links-theme-picture-radius));
}
</style>
