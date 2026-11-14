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

/* An avatar stored before the uploader holds a full url; anything else is a storage file id. */
const ABSOLUTE_URL = /^https?:\/\//;

const bp = computed(() => {
  const p = props.properties;
  const stored = (p.image as IBlockPropertyImage | undefined)?.value;
  const image = stored
    ? ABSOLUTE_URL.test(stored)
      ? stored
      : StorageApi.resolveImageUrl(stored, { origin: config.public.backendUrl })
    : "";
  const size = (p.size as IBlockPropertyNumber | undefined)?.value;

  return {
    image: image ?? "",
    text: (p.text as IBlockPropertyText | undefined)?.value,
    link: (p.link as IBlockPropertyUrl | undefined)?.value,
    /* A block stored before these properties existed renders at the size and shape it always had. */
    style: {
      "--avatar-size": `${size ?? 100}px`,
      "--avatar-radius": (p.shape as IBlockPropertySelect | undefined)?.value === "rounded" ? "12px" : "100%",
    },
  };
});
</script>

<template>
  <div class="avatar-block" :style="bp.style">
    <component
      :is="bp.link ? 'a' : 'div'"
      class="avatar-block__media"
      :href="bp.link || undefined"
      :rel="bp.link ? 'noopener noreferrer' : undefined"
    >
      <img class="avatar-block__image" :src="bp.image" :alt="bp.text ?? ''" />
    </component>
    <h3 class="avatar-block__heading" v-text="bp.text" />
  </div>
</template>

<style>
.avatar-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
}
.avatar-block__media {
  display: block;
  line-height: 0;
}
.avatar-block__image {
  width: var(--avatar-size, 100px);
  max-width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--avatar-radius, 100%);
}
.avatar-block__heading {
  font-size: 1.3rem;
  font-weight: 600;
}
</style>
