<script setup lang="ts">
import InsertBlockButton from "./insert-block-button.vue";
import PageBlockActions from "./page-block-actions/page-block-actions.vue";

interface IPageBlockProps {
  isSelected: boolean;
  /** A block its schedule hides stays in the constructor — dimmed and badged — so it can be edited. */
  isHidden: boolean;
  /** The position this block has in the page: the insert marker above it inserts here. */
  index: number;
  /** Only the last block offers a marker below itself, which is how a page is appended to. */
  isLast: boolean;
}
defineProps<IPageBlockProps>();

defineEmits<{
  select: [];
  insert: [index: number];
}>();
</script>

<template>
  <div class="group relative flex" :data-block-selected="isSelected" :data-block-hidden="isHidden">
    <InsertBlockButton edge="top" @insert="$emit('insert', index)" />
    <InsertBlockButton v-if="isLast" edge="bottom" @insert="$emit('insert', index + 1)" />
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
    >
      <span
        v-if="isHidden"
        class="i-lucide:eye-off absolute right-1 top-1 text-moon-16 text-trunks"
        data-testid="page-block-hidden-badge"
        role="img"
        aria-label="Hidden"
      />
    </div>
    <div class="w-full" :class="{ 'opacity-40': isHidden }">
      <slot />
    </div>
  </div>
</template>
