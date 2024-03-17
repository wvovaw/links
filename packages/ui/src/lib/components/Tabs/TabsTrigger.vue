<script setup lang="ts">
import type { HTMLAttributes, Ref } from "vue";
import { computed, inject } from "vue";

import { TabsTrigger, type TabsTriggerProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const tabsTriggerVariants = cva("flex items-center justify-center w-full overflow-clip whitespace-nowrap font-medium cursor-pointer duration-300", {
  variants: {
    variant: {
      pill: "rounded-moon-i-sm transition-colors data-[active=true]:text-goten data-[active=false]:text-trunks data-[active=false]:hover:bg-heles data-[active=true]:bg-popo",
      tab: "relative after:absolute after:content-[''] after:start-0 after:bottom-0 after:w-full after:bg-piccolo after:transition-transform after:duration-300 ltr:hover:after:origin-top-left rtl:hover:after:origin-top-right data-[state=active]:(after:scale-y-100 ltf:after:origin-top-left rtl:after:origin-top-right after:scale-x-100 text-piccolo) data-[state=inactive](text-bulma ltr:after:origin-top-left rtl:after:origin-top-right after:scale-x-0 after:scale-y-100)",
    },
    size: {
      sm: "px-2 py-0.6 gap-1 text-moon-12 ",
      md: "px-3 py-1 gap-1 text-moon-14 ",
      lg: "px-4 py-2 gap-2 text-moon-14 ",
    },
    disabled: {
      true: "cursor-not-allowed opacity-60",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "tab", size: ["sm", "md"], class: "after:h-[2px]" },
    { variant: "tab", size: "lg", class: "after:h-[3px]" },
    { variant: "tab", disabled: false, class: "hover:after:scale-100 hover:text-piccolo" },
    { variant: "pill", disabled: true, class: "hover:bg-transparent!" },
  ],
});
type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>;

const props = defineProps<TabsTriggerProps & {
  class?: HTMLAttributes["class"];
  disabled?: boolean;
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);

// Provided by TabsList.vue
const listParams = inject<{ size: Ref<TabsTriggerVariants["size"]>; variant: Ref<TabsTriggerVariants["variant"]> }>("tabsList");
</script>

<template>
  <TabsTrigger
    :class="[tabsTriggerVariants({ size: listParams?.size.value, variant: listParams?.variant.value, disabled }), props.class]"
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>
