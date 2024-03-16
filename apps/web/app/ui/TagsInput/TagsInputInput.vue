<script setup lang="ts">
import { TagsInputInput, type TagsInputInputProps, useForwardProps } from "radix-vue";
import { cva } from "cva";
import type { HTMLAttributes } from "vue";

const tagsInputInputVariants = cva("py-0 px-0 m-0 leading-6 h-6 appearance-none text-bulma box-border focus:outline-none flex-1 bg-transparent", {
  variants: {
    size: { sm: "text-moon-14", md: "text-moon-16", lg: "text-moon-16" },
  },
});
const props = defineProps<TagsInputInputProps & {
  class?: HTMLAttributes["class"];
}>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);

const tagsInputConf = inject<{
  size: "sm" | "md" | "lg";
}>("tagsInput");

const inputSize = tagsInputConf?.size ?? "md";
</script>

<template>
  <TagsInputInput v-bind="forwardedProps" :class="[tagsInputInputVariants({ size: inputSize }), props.class]" />
</template>
