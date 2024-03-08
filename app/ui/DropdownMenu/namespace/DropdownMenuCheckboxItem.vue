<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from "radix-vue";
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator, useForwardPropsEmits } from "radix-vue";

const props = defineProps<DropdownMenuCheckboxItemProps & {
  class?: HTMLAttributes["class"];
}>();
const emits = defineEmits<DropdownMenuCheckboxItemEmits>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DropdownMenuCheckboxItem
    v-bind="forwarded"
    class="relative flex cursor-default select-none items-center rounded-moon-i-sm py-1.5 pl-8 pr-2 text-moon-14 outline-none transition-colors focus:bg-berus focus:text-bulma data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    :class="[
      props.class,
    ]"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <span class="i-lucide:check h-2 w-2" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>
