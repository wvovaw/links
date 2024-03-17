<script setup lang="ts">
import { type VariantProps, cva } from "cva";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  variant?: PreviewFrameVariants["variant"];
}>();
const previewFrameVariants = cva("flex flex-wrap items-center justify-around p-4 gap-2 w-full text-moon-14 rounded-moon-s-sm not-prose", {
  variants: {
    variant: {
      default: "bg-gohan ",
      outline: "border border-beerus",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
type PreviewFrameVariants = VariantProps<typeof previewFrameVariants>;
</script>

<!-- TODO: add preview/code tabs with code preview -->
<template>
  <section class="my-5">
    <div class="pattern shadow-moon-sm" :class="[previewFrameVariants({ variant }), props.class]">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.pattern {
  background-image: linear-gradient(to top, var(--beerus) 1px, transparent 1px), linear-gradient(to left, var(--beerus) 1px, transparent 1px);
  background-size: 25px 25px;
  background-color: var(--gohan);
}
</style>
