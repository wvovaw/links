<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const accordionTriggerVariants = cva("w-full rounded-moon-s-sm bg-goku data-[state=open]:(rounded-b-none) group w-full justify-between flex items-center relative gap-1 cursor-pointer flex-1 font-medium text-bulma text-start data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60", {
  variants: {
    size: {
      sm: "text-moon-12 p-2",
      md: "text-moon-14 ps-2 pe-3 py-2",
      lg: "text-moon-14 p-3",
      xl: "text-moon-16 p-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
type AccordionTriggerVariants = VariantProps<typeof accordionTriggerVariants>;

const props = defineProps<AccordionTriggerProps & {
  class?: HTMLAttributes["class"];
  size?: AccordionTriggerVariants["size"];
}>();

const delegatedProps = computed(() => {
  const { class: _, size: _si, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      v-bind="delegatedProps"
      :class="[accordionTriggerVariants({ size }), props.class]"
    >
      <slot />
      <slot name="icon">
        <span
          class="i-lucide:chevron-down h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </slot>
    </AccordionTrigger>
  </AccordionHeader>
</template>
