<script setup lang="ts">
import { type VariantProps, cva } from "cva";
import { toKebabCase } from "~utils/strings";

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

const props = defineProps<{
  title?: string;
  variant?: PreviewFrameVariants["variant"];
}>();

const anchor = `#${props.title ? toKebabCase(props.title) : ""}`;
</script>

<!-- TODO: add preview/code tabs with code preview -->
<template>
  <section class="my-5">
    <header class="w-full text-moon-20 h-16">
      <h3>
        <a :href="anchor">
          {{ title ? title : "Provide a title!" }}
        </a>
      </h3>
    </header>
    <div :class="previewFrameVariants({ variant })">
      <slot />
    </div>
  </section>
</template>
