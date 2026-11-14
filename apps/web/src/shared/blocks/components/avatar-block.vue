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
  const size = (p.size as IBlockPropertyNumber | undefined)?.value;

  return {
    image:
      resolveBlockImageUrl((p.image as IBlockPropertyImage | undefined)?.value, {
        origin: config.public.backendUrl,
      }) ?? "",
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
/* `size` caps the longest edge: the image keeps its own ratio, as it did at the old fixed 100px cap. */
.avatar-block__image {
  max-width: var(--avatar-size, 100px);
  max-height: var(--avatar-size, 100px);
  width: auto;
  height: auto;
  border-radius: var(--avatar-radius, 100%);
}
.avatar-block__heading {
  font-size: 1.3rem;
  font-weight: 600;
}
</style>
