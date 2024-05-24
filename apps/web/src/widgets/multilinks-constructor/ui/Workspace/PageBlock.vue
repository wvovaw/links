<script setup lang="ts">
import PageBlockActions from "./page-block-actions/PageBlockActions.vue";

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
    <Transition
      appear
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
    >
      <PageBlockActions v-if="isSelected" />
    </Transition>
    <div
      class="absolute box-border h-full w-full outline-(2 dashed) transition-colors duration-200 ease-in"
      :class="{
        'outline-popo': isSelected,
        'outline-transparent': !isSelected,
      }"
      data-testid="page-block"
      @click.stop="$emit('select')"
    />
    <slot />
  </div>
</template>
