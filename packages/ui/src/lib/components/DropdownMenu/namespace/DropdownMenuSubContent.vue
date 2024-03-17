<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { DropdownMenuSubContentEmits, DropdownMenuSubContentProps } from "radix-vue";
import { DropdownMenuPortal, DropdownMenuSubContent, useForwardPropsEmits } from "radix-vue";

const props = defineProps<DropdownMenuSubContentProps & {
  class?: HTMLAttributes["class"];
}>();
const emits = defineEmits<DropdownMenuSubContentEmits>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuSubContent
      v-bind="forwarded"
      class="z-50 min-w-42 overflow-hidden rounded-moon-s-sm border border-beerus bg-goku p-1 text-bulma shadow-moon-md data-[state=open]:(animate-in fade-in-0 zoom-in-95) data-[state=closed]:(animate-out fade-out-0 zoom-out-95) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      :class="[props.class]"
    >
      <slot />
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</template>
