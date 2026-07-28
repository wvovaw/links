<script setup lang="ts">
import type { BlockProperty, IBlockPropertyImage, IBlockPropertyUrl } from "@links/blocks";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const config = useRuntimeConfig();

const bp = computed(() => {
  const p = props.properties;
  return {
    image: p.image!.value ? `${config.public.backendUrl}/storage/images/${(p.image as IBlockPropertyImage).value}` : "",
    imageBorderRadius: "var(--links-theme-picture-radius)",
  };
});
</script>

<template>
  <div class="picture-block">
    <img class="picture-block__image" :src="bp.image">
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
  border-radius: v-bind('bp.imageBorderRadius');
}
</style>
