<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from "radix-vue";
import type { CheckboxRootEmits, CheckboxRootProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const checkboxRootVariants = cva("shrink-0 border border-trunks ring-offset-2 ring-offset-goku focus:outline-none focus-visible:ring-2 ring-bulma", {
  variants: {
    color: {
      default: "data-[state=checked]:(shadow-none text-goku bg-bulma border-bulma)",
      piccolo: "data-[state=checked]:(shadow-none text-goku bg-piccolo border-piccolo)",
      hit: "data-[state=checked]:(shadow-none text-goku bg-hit border-hit)",
      roshi: "data-[state=checked]:(shadow-none text-goku bg-roshi border-roshi)",
      chichi: "data-[state=checked]:(shadow-none text-goku bg-chichi border-chichi)",
      krillin: "data-[state=checked]:(shadow-none text-goku bg-krillin border-krillin)",
    },
    size: { sm: "h-4 w-4 rounded-moon-i-xs", md: "h-6 w-6 rounded-moon-i-sm" },
    disabled: { true: "opacity-60 cursor-not-allowed", false: "" },
  },
  defaultVariants: {
    color: "default",
    size: "sm",
  },
});
type CheckboxRootVariants = VariantProps<typeof checkboxRootVariants>;
// TODO: Find out how to export props type
// export type CheckboxVariants = CheckboxRootVariants;

const props = defineProps<CheckboxRootProps & {
  class?: HTMLAttributes["class"];
  color?: CheckboxRootVariants["color"];
  size?: CheckboxRootVariants["size"];
}>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _cl, color: _co, size: _si, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="[checkboxRootVariants({ color, size, disabled }), props.class]"
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current group">
      <slot>
        <span class="i-lucide:check group-data-[state=indeterminate]:(i-lucide:minus) w-4 h-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
