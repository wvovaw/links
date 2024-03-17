<script setup lang="ts">
import { type VariantProps, cva } from "cva";
import { type HTMLAttributes, computed, getCurrentInstance } from "vue";

const badgeVariants = cva(
  "flex items-center rounded-moon-i-xs gap-1 select-none uppercase font-medium data-[disabled]:opacity-60",
  {
    variants: {
      variant: {
        fill: "",
        outline: "",
      },
      size: {
        xs: "py-0 px-2 h-4 text-moon-9-caption font-semibold",
        sm: "py-1 px-2 h-6 text-moon-10-caption font-semibold",
      },
      color: { default: "", piccolo: "", hit: "", roshi: "", chichi: "", krillin: "" },
    },
    compoundVariants: [
      { color: "default", variant: "fill", class: "text-goku bg-bulma" },
      { color: "default", variant: "outline", class: "border-(1 bulma)" },
      { color: "piccolo", variant: "fill", class: "text-goku bg-piccolo" },
      { color: "piccolo", variant: "outline", class: "text-piccolo border-(1 piccolo)" },
      { color: "hit", variant: "fill", class: "text-goku bg-hit" },
      { color: "hit", variant: "outline", class: "text-hit border-(1 hit)" },
      { color: "chichi", variant: "fill", class: "text-goku bg-chichi" },
      { color: "chichi", variant: "outline", class: "text-chichi border-(1 chichi-60)" },
      { color: "krillin", variant: "fill", class: "text-goku bg-krillin" },
      { color: "krillin", variant: "outline", class: "text-krillin border-(1 krillin-60)" },
      { color: "roshi", variant: "fill", class: "text-goku bg-roshi" },
      { color: "roshi", variant: "outline", class: "text-roshi border-(1 roshi-60)" },
    ],
    defaultVariants: {
      variant: "fill",
      color: "default",
      size: "sm",
    },
  },
);
const iconVariants = cva("", {
  variants: {
    size: { xs: "text-moon-12", sm: "text-moon-14" },
  },
  defaultVariants: {
    size: "sm",
  },
});
type BadgeVariants = VariantProps<typeof badgeVariants>;

const props = withDefaults(defineProps<{
  class?: HTMLAttributes["class"];
  variant?: BadgeVariants["variant"];
  size?: BadgeVariants["size"];
  color?: BadgeVariants["color"];
  iconLeft?: string;
  iconRight?: string;
}>(), {
  size: "sm",
  variant: "fill",
  color: "default",
});

const emit = defineEmits<{
  iconLeftClick: [];
  iconRightClick: [];
}>();

const hasLeftIconClickEventListener = computed(() =>
  !!getCurrentInstance()?.vnode.props?.onIconLeftClick,
);
const hasRightIconClickEventListener = computed(() =>
  !!getCurrentInstance()?.vnode.props?.onIconRightClick,
);
</script>

<template>
  <div :class="[badgeVariants({ variant, size, color }), props.class ?? '']" v-bind="$attrs">
    <component
      :is="hasLeftIconClickEventListener ? 'button' : 'span'"
      v-if="iconLeft !== undefined"
      :class="[iconVariants({ size }), iconLeft]"
      aria-hidden="true"
      @click="emit('iconLeftClick')"
    />
    <slot />
    <component
      :is="hasRightIconClickEventListener ? 'button' : 'span'"
      v-if="iconRight !== undefined"
      :class="[iconVariants({ size }), iconRight]"
      aria-hidden="true"
      @click="emit('iconRightClick')"
    />
  </div>
</template>
