<script setup lang="ts">
import { type HTMLAttributes, computed, inject, toRefs } from "vue";
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const tabsTriggerVariants = cva("flex items-center justify-center w-full whitespace-nowrap text-moon-14 font-medium rounded-moon-i-sm data-[active=true]:text-goten data-[active=false]:text-trunks transition-colors cursor-pointer data-[active=false]:hover:bg-heles data-[active=true]:bg-popo", {
  variants: {
    size: {
      sm: "px-2 py-0.6 gap-1 ",
      md: "px-3 py-1 gap-1 ",
      lg: "px-4 py-2 gap-2 ",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>;

const props = defineProps<TabsTriggerProps & {
  class?: HTMLAttributes["class"];
  size?: TabsTriggerVariants["size"];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

// Provided by TabsList.vue
const listSize = inject<{ size: "lg" | "md" | "sm" }>("tabsList", { size: "md" });
</script>

<template>
  <TabsTrigger
    :class="[tabsTriggerVariants({ size: props.size || listSize.size }), props.class]"
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>
