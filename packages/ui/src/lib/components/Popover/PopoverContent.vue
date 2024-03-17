<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from "radix-vue";
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from "radix-vue";
import { type HTMLAttributes, computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PopoverContentProps & {
  class?: HTMLAttributes["class"];
}>(), {
  align: "center",
  sideOffset: 6,
});
const emits = defineEmits<PopoverContentEmits>();

const delegatedProps = computed(() => {
  const { class: _cl, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="forwarded"
      class="w-72 p-4 z-[999999] overflow-hidden rounded-moon-s-md box-border bg-goku shadow-moon-lg focus:outline-none p-2 flex flex-col gap-1 data-[state=open]:(animate-in fade-in-0 zoom-in-95) data-[state=closed]:(animate-out fade-out-0 zoom-out-95)  data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      :class="props.class"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
