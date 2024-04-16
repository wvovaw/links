<script setup lang="ts">
import type { BlockProperty, IBlockPropertyText, IBlockPropertyUrl } from "../../core";

const props = defineProps<{
  properties: Record<string, BlockProperty>;
}>();

const bp = computed(() => {
  const p = props.properties;
  return {
    text: (p.text as IBlockPropertyText).value,
    image: p.image.value ? (p.image as IBlockPropertyUrl).value : "",
  };
});
</script>

<template>
  <div class="avatar-block">
    <img class="avatar-block__image" :src="bp.image">
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
.avatar-block__image {
  max-width: 100px;
  border-radius: 100%;
}
.avatar-block__heading {
  font-size: 1.3rem;
  font-weight: 600;
}
</style>
