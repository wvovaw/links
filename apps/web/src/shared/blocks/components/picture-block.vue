<script setup lang="ts">
import type {
  BlockProperty,
  IBlockPropertyImage,
  IBlockPropertyNumber,
  IBlockPropertySelect,
  IBlockPropertyText,
  IBlockPropertyUrl,
} from "@links/blocks";

import { resolveBlockImageUrl } from "~shared/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const bp = computed(() => {
  const p = props.properties;
  const radius = (p.radius as IBlockPropertyNumber | undefined)?.value;

  return {
    image:
      resolveBlockImageUrl((p.image as IBlockPropertyImage | undefined)?.value, {
        origin: config.public.backendUrl,
      }) ?? "",
    /* A picture stored before these properties existed is decorative, lazy and cropped the same way. */
    alt: (p.alt as IBlockPropertyText | undefined)?.value ?? "",
    loading: (p.loading as IBlockPropertySelect<"eager" | "lazy"> | undefined)?.value ?? "lazy",
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
      <img v-if="bp.image" class="picture-block__image" :src="bp.image" :alt="bp.alt" :loading="bp.loading" />
      <div v-else class="picture-block__placeholder" />
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
/* A stored picture keeps its own ratio, exactly as it rendered before the properties existed. */
.picture-block__image {
  max-width: 100%;
  height: auto;
  object-fit: var(--picture-object-fit, cover);
  border-radius: var(--picture-radius, var(--links-theme-picture-radius));
}
/*
  Fallback box only, for a picture with no image yet: reserving 16/9 keeps the page from shifting when
  one is added or loads. A picture that has an image never gets this box, because the page must keep
  rendering exactly as it does today.
*/
.picture-block__placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--picture-radius, var(--links-theme-picture-radius));
}
</style>
