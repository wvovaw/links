<script setup lang="ts">
import { type VariantProps, cva } from "cva";
import type { HTMLAttributes } from "vue";

const avatarIndicatorVariant = cva("absolute w-3 h-3 border border-2px border-gohan rounded-full", {
  variants: {
    vertical: {
      top: "top-0",
      bottom: "bottom-0",
    },
    horizontal: {
      start: "start-0",
      end: "end-0",
    },
    color: {
      roshi: "bg-roshi",
      krillin: "bg-krillin",
      chichi: "bg-chichi",
    },
    ping: {
      true: "animate-ping",
      false: "",
    },
  },
  defaultVariants: {
    vertical: "bottom",
    horizontal: "end",
    color: "roshi",
  },
});
type AvatarVariantProps = VariantProps<typeof avatarIndicatorVariant>;

const props = defineProps<{
  class?: HTMLAttributes["class"];
  vertical?: AvatarVariantProps["vertical"];
  horizontal?: AvatarVariantProps["horizontal"];
  color?: AvatarVariantProps["color"];
  ping?: AvatarVariantProps["ping"];
}>();
</script>

<template>
  <span :class="[avatarIndicatorVariant({ vertical, horizontal, color }), props.class]" aria-hidden="true" />
  <span v-if="ping" :class="[avatarIndicatorVariant({ vertical, horizontal, color, ping }), props.class]" aria-hidden="true" />
</template>
