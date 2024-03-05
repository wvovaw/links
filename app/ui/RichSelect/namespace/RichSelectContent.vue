<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectViewport,
  useForwardPropsEmits,
} from "radix-vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectContentProps & {
  class?: HTMLAttributes["class"];
}>(), {
  position: "popper",
});
const emits = defineEmits<SelectContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }" class="border-box relative w-full min-w-32 max-h-96 z-50 absolute p-1 my-2 rounded-moon-s-md box-border bg-goku shadow-moon-lg overflow-y-auto focus:outline-none data-[state=open]:(animate-in fade-in-0 zoom-in-95) data-[state=closed]:(animate-out fade-out-0 zoom-out-95) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      :class="[
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        props.class,
      ]"
    >
      <SelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
        <span class="i-lucide:chevron-up h-4 w-4" />
      </SelectScrollUpButton>

      <SelectViewport :class="[position === 'popper' && 'h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]']">
        <slot />
      </SelectViewport>

      <SelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
        <span class="i-lucide:chevron-down h-4 w-4" />
      </SelectScrollDownButton>
    </SelectContent>
  </SelectPortal>
</template>
