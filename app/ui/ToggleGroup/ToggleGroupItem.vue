<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ToggleGroupItem, type ToggleGroupItemProps, useForwardProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const toggleEl = ref<HTMLElement | null>(null);
const sl = useSlots();
const noChildren = !sl?.default; // checking if default slot is empty

// FIXME: Try to fix it after UI moved to separate package of a monorepo
// This is a dupe of the Toggle.vue variants
const toggleVariants = cva("z-0 overflow-hidden flex flex-row items-center justify-center text-moon-14 font-medium relative whitespace-nowrap select-none space-between cursor-pointer transition duration-200", {
  variants: {
    variant: { default: "", ghost: "" },
    color: { piccolo: "", hit: "", roshi: "", chichi: "", krillin: "" },
    withStroke: { true: "", false: "" },
    iconOnly: { true: "", false: "" },
    iconPos: { left: "", right: "" },
    size: {
      sm: "h-8 text-moon-14 rounded-moon-i-sm",
      md: "h-10 text-moon-14 rounded-moon-i-sm ",
    },
    disabled: { true: "opacity-60 cursor-not-allowed", false: "" },
  },
  compoundVariants: [
    /* Sizing and paddings for icon-only buttons */
    { iconOnly: true, size: ["sm"], class: "h-8! w-8!" },
    { iconOnly: true, size: ["md"], class: "h-10! w-10!" },
    /* Sizing and paddings depending on icon pos */
    { iconOnly: false, iconPos: "left", size: ["sm"], class: "ps-2 pe-2 py-1 gap-1" },
    { iconOnly: false, iconPos: "right", size: ["sm"], class: "ps-2 pe-2 py-1 gap-1" },
    { iconOnly: false, iconPos: "left", size: ["md"], class: "ps-3 pe-3 py-2 gap-2" },
    { iconOnly: false, iconPos: "right", size: ["md"], class: "ps-3 pe-3 py-2 gap-2" },

    /* default variant colors */
    /* ghost variant colors */
    { variant: "default", color: ["piccolo", "hit", "chichi", "krillin", "roshi"], class: "bg-goku text-bulma" },
    { variant: "ghost", color: ["piccolo", "hit", "chichi", "krillin", "roshi"], class: "text-bulma" },

    /* Pressed state */
    { color: "piccolo", class: "data-[state=on]:(text-piccolo bg-jiren)" },
    { color: "hit", class: "data-[state=on]:(text-hit bg-jira)" },
    { color: "chichi", class: "data-[state=on]:(text-chichi bg-chichi-60)" },
    { color: "krillin", class: "data-[state=on]:(text-krillin bg-krillin-60)" },
    { color: "roshi", class: "data-[state=on]:(text-roshi bg-roshi-60)" },
    { withStroke: true, class: "data-[state=on]:([box-shadow:_0_0_0_2px_inset])" },

    /* Hover state */
    { disabled: false, color: "piccolo", class: "data-[state=off]:(hover:(text-trunks bg-jiren))" },
    { disabled: false, color: "hit", class: "data-[state=off]:(hover:(text-trunks bg-jira))" },
    { disabled: false, color: "chichi", class: "data-[state=off]:(hover:(text-trunks bg-chichi-60))" },
    { disabled: false, color: "krillin", class: "data-[state=off]:(hover:(text-trunks bg-krillin-60))" },
    { disabled: false, color: "roshi", class: "data-[state=off]:(hover:(text-trunks bg-roshi-60))" },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    color: "piccolo",
    withStroke: false,
    iconPos: "left",
  },
});
type ToggleGroupItemVariants = VariantProps<typeof toggleVariants>;

const props = withDefaults(defineProps<ToggleGroupItemProps & {
  class?: HTMLAttributes["class"];
  variant?: ToggleGroupItemVariants["variant"];
  color?: ToggleGroupItemVariants["color"];
  withStroke?: ToggleGroupItemVariants["withStroke"];
  size?: ToggleGroupItemVariants["size"];
  icon?: string;
  iconPos?: ToggleGroupItemVariants["iconPos"];
}>(), {
  iconPos: "left",
  size: "md",
  color: "piccolo",
});

// Provided by ToggleGroup.vue
const context = inject<{
  variant: ToggleGroupItemVariants["variant"];
  color: ToggleGroupItemVariants["color"];
  size: ToggleGroupItemVariants["size"];
  withStroke: Extract<ToggleGroupItemVariants["withStroke"], boolean>;
  disabled: boolean;
}>("toggleGroup");

const delegatedProps = computed(() => {
  const { class: _, variant: _v, size: _s, color: _c, withStroke: _ws, icon: _i, iconPos: _ip, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ToggleGroupItem
    v-bind="forwardedProps"
    ref="toggleEl"
    :class="toggleVariants({
      variant: context?.variant || variant,
      size: context?.size || size,
      color: context?.color || color,
      withStroke: context?.withStroke || withStroke,
      disabled: context?.disabled || disabled,
      iconOnly: noChildren,
    })"
  >
    <span
      v-if="icon && iconPos === 'left'"
      aria-hidden="true"
      class="text-moon-16"
      :class="icon"
    />
    <slot />
    <span
      v-if="icon && iconPos === 'right'"
      aria-hidden="true"
      class="text-moon-16"
      :class="icon"
    />
  </ToggleGroupItem>
</template>
