<script setup lang="ts">
import type { BlockProperty, IBlockPropertyImage } from "@links/blocks";

import { StorageApi } from "~shared/api/backend";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const bp = computed(() => {
  const p = props.properties;
  return {
    image:
      StorageApi.resolveImageUrl((p.image as IBlockPropertyImage).value, { origin: config.public.backendUrl }) ?? "",
    imageBorderRadius: "var(--links-theme-picture-radius)",
  };
});
</script>

<template>
  <div class="picture-block">
    <img class="picture-block__image" :src="bp.image" />
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
.picture-block__image {
  border-radius: v-bind("bp.imageBorderRadius");
}
</style>
