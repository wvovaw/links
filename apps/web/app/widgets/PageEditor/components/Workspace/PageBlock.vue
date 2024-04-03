<script setup lang="ts">
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
    class="relative w-full flex items-center"
    :data-block-selected="isSelected"
  >
    <div
      class="absolute h-full w-full"
      :class="{
        'box-border outline-(2 dashed popo)': isSelected,
      }"
      @click.stop="$emit('select')"
    />
    <slot />
  </div>
</template>
