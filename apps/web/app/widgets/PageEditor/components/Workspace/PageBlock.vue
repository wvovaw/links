<script setup lang="ts">
import BlockActions from "./BlockActions.vue";

interface IPageBlockProps {
  isSelected: boolean;
}
defineProps<IPageBlockProps>();

defineEmits<{
  select: [];
}>();
</script>

<template>
  <div
    class="relative flex"
    :data-block-selected="isSelected"
  >
    <BlockActions v-if="isSelected" />
    <div
      class="absolute box-border h-full w-full outline-(2 dashed) transition-colors duration-200 ease-in"
      :class="{
        'outline-popo': isSelected,
        'outline-transparent': !isSelected,
      }"
      @click.stop="$emit('select')"
      data-testid="page-block"
    />
    <slot />
  </div>
</template>
