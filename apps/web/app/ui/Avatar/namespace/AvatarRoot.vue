<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AvatarRoot } from "radix-vue";
import { type VariantProps, cva } from "cva";

const avatarVariant = cva(
  "relative overflow-hidden uppercase font-medium inline-flex items-center justify-center select-none overflow-hidden shrink-0 text-bulma bg-goku",
  {
    variants: {
      size: {
        "xs": "h-6 w-6 text-moon-10-caption [&_.status]:w-3 [&_.status]:h-3 [&_.status]:border-2",
        "sm": "h-8 w-8  text-moon-12 [&_.status]:w-3 [&_.status]:h-3 [&_.status]:border-2",
        "md": "h-10 w-10 text-moon-14 [&_.status]:w-3 [&_.status]:h-3 [&_.status]:border-2",
        "lg": "h-12 w-12 text-moon-16 [&_.status]:w-4 [&_.status]:h-4 [&_.status]:border-2",
        "xl": "h-14 w-14 text-moon-16 [&_.status]:w-4 [&_.status]:h-4 [&_.status]:border-2",
        "2xl": "h-16 w-16 text-moon-20 [&_.status]:w-4 [&_.status]:h-4 [&_.status]:border-2",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-moon-i-sm",
      },
    },
    compoundVariants: [
      {
        size: "2xl",
        shape: "circle",
        class: "rounded-moon-i-md",
      },
    ],
    defaultVariants: {
      size: "md",
      shape: "square",
    },
  },
);
type AvatarVariants = VariantProps<typeof avatarVariant>;

const props = defineProps<{
  class?: HTMLAttributes["class"];
  size?: AvatarVariants["size"];
  shape?: AvatarVariants["shape"];
}>();
</script>

<template>
  <AvatarRoot :class="[avatarVariant({ size, shape }), props.class]">
    <slot />
  </AvatarRoot>
</template>
