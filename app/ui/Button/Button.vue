<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const btnEl = ref<HTMLElement | null>(null);
const isHovered = useElementHover(btnEl);
const sl = useSlots();
const noChildren = !sl?.default; // checking if default slot is empty

const buttonVariants = cva(
  "relative z-0 flex justify-center items-center font-medium no-underline overflow-hidden whitespace-nowrap select-none transition-(colors shadow transform) duration-200 ",
  {
    variants: {
      variant: {
        fill: "focus:(ring-3 outline-none)",
        outline: "bg-transparent ring-inset ring-1 focus:(ring-3 outline-none) font-semibold",
        ghost: "bg-transparent text-trunks focus:(ring-1 outline-none)",
        link: "text-bulma bg-transparent ring-none underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6  text-moon-12 rounded-moon-i-xs",
        sm: "h-8  text-moon-14 rounded-moon-i-sm",
        md: "h-10 text-moon-14 rounded-moon-i-sm ",
        lg: "h-12 text-moon-16 rounded-moon-i-sm",
        xl: "h-14 text-moon-16 rounded-moon-i-md",
      },
      color: { piccolo: "", hit: "", roshi: "", chichi: "", krillin: "" },
      fullWidth: { true: "w-full", false: "" },
      hasIconOrLoading: { true: "", false: "" },
      iconOnly: { true: "", false: "" },
      iconPos: { left: "", right: "" },

      disabled: { true: "opacity-60 cursor-not-allowed", false: "" },
      animation: { error: "animate-error bg-chichi! ring-chichi-60!", pulse: "animate-pulse2" },
    },
    compoundVariants: [
      /* Sizing and paddings for icon-only buttons */
      { iconOnly: true, size: ["xs"], class: "h-6! w-6!" },
      { iconOnly: true, size: ["sm"], class: "h-8! w-8!" },
      { iconOnly: true, size: ["md"], class: "h-10! w-10!" },
      { iconOnly: true, size: ["lg"], class: "h-12! w-12!" },
      { iconOnly: true, size: ["xl"], class: "h-14! w-14!" },

      /* Sizing and paddings withou icons */
      { hasIconOrLoading: false, size: ["xs"], class: "px-2 py-1" },
      { hasIconOrLoading: false, size: ["sm"], class: "px-3 py-1" },
      { hasIconOrLoading: false, size: ["md"], class: "px-4 py-2" },
      { hasIconOrLoading: false, size: ["lg"], class: "px-4 py-3" },
      { hasIconOrLoading: false, size: ["xl"], class: "px-6 py-4" },

      /* Sizing and paddings depending on icon pos */
      { iconOnly: false, hasIconOrLoading: true, iconPos: "left", size: ["xs"], class: "ps-2 pe-2 py-1 gap-1" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "right", size: ["xs"], class: "ps-2 pe-2 py-1 gap-1" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "left", size: ["sm"], class: "ps-2 pe-2 py-1 gap-1" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "right", size: ["sm"], class: "ps-2 pe-2 py-1 gap-1" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "left", size: ["md"], class: "ps-3 pe-3 py-2 gap-2" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "right", size: ["md"], class: "ps-3 pe-3 py-2 gap-2" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "left", size: ["lg"], class: "ps-3 pe-4 py-3 gap-2" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "right", size: ["lg"], class: "ps-4 pe-3 py-3 gap-2" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "left", size: ["xl"], class: "ps-4 pe-5 py-4 gap-2" },
      { iconOnly: false, hasIconOrLoading: true, iconPos: "right", size: ["xl"], class: "ps-5 pe-4 py-4 gap-2" },

      /* scale animation */
      { disabled: false, variant: ["fill", "outline", "ghost"], class: "active:scale-90" },
      /* Fill buttons */
      { variant: ["fill"], color: ["piccolo"], class: "text-goten bg-piccolo [box-shadow:_0_0_0_0_var(--piccolo)] ring-jiren" },
      { variant: ["fill"], color: ["hit"], class: "text-goten bg-hit [box-shadow:_0_0_0_0_var(--hit)] ring-jira" },
      { variant: ["fill"], color: ["chichi"], class: "text-popo bg-chichi [box-shadow:_0_0_0_0_var(--chichi)] ring-chichi-60" },
      { variant: ["fill"], color: ["krillin"], class: "text-popo bg-krillin [box-shadow:_0_0_0_0_var(--krillin)] ring-krillin-60" },
      { variant: ["fill"], color: ["roshi"], class: "text-bulma bg-roshi [box-shadow:_0_0_0_0_var(--roshi)] ring-roshi-60" },
      /* Outline buttons */
      { variant: ["outline"], color: ["piccolo"], class: "text-piccolo ring-piccolo" },
      { variant: ["outline"], color: ["hit"], class: "text-hit ring-hit" },
      { variant: ["outline"], color: ["chichi"], class: "text-chichi ring-chichi" },
      { variant: ["outline"], color: ["krillin"], class: "text-krillin ring-krillin" },
      { variant: ["outline"], color: ["roshi"], class: "text-roshi ring-roshi" },
      /* Ghost buttons (only enabled colored) */
      { variant: ["ghost"], color: ["piccolo", "hit", "chichi", "krillin", "roshi"], disabled: false, class: "hover:text-bulma ring-bulma focus:ring-1px" },
      /* Link buttons */
      { variant: ["link"], color: ["piccolo"], class: "text-piccolo font-semibold" },
      { variant: ["link"], color: ["hit"], class: "text-hit font-semibold" },
      { variant: ["link"], color: ["chichi"], class: "text-chichi font-semibold" },
      { variant: ["link"], color: ["krillin"], class: "text-krillin font-semibold" },
      { variant: ["link"], color: ["roshi"], class: "text-roshi font-semibold" },
    ],
    defaultVariants: {
      variant: "fill",
      color: "piccolo",
      size: "md",
      fullWidth: false,
    },
  },
);

const buttonIconVariants = cva("", {
  variants: {
    fullWidth: { true: "", false: "" },
    iconPos: { left: "", right: "" },
    loading: { true: "i-lucide:loader! animate-spin", false: "" },
  },
  compoundVariants: [
    { iconPos: "left", fullWidth: true, class: "absolute block start-3" },
    { iconPos: "right", fullWidth: true, class: "absolute block end-3" },
  ],
  defaultVariants: {
    iconPos: "left",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;
type ButtonIconVariants = VariantProps<typeof buttonIconVariants>;

const props = withDefaults(defineProps<PrimitiveProps & {
  class?: HTMLAttributes["class"];
  type?: ButtonHTMLAttributes["type"];
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  color?: ButtonVariants["color"];
  icon?: string;
  iconPos?: ButtonIconVariants["iconPos"];
  animation?: ButtonVariants["animation"];
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}>(), {
  as: "button",
  variant: "fill",
  size: "md",
  color: "piccolo",
  iconPos: "left",
});
</script>

<template>
  <Primitive
    ref="btnEl"
    :class="[buttonVariants({ variant, size, color, fullWidth, hasIconOrLoading: (!!icon || loading), iconPos, iconOnly: noChildren, animation, disabled }), props.class]"
    :disabled="disabled"
    :as="as"
    :as-child="asChild"
    v-bind="$attrs"
  >
    <span
      v-if="iconPos === 'left' && (icon || loading)"
      aria-hidden="true"
      :class="[icon, buttonIconVariants({ iconPos, fullWidth, loading })]"
    />
    <slot />
    <span
      v-if="iconPos === 'right' && (icon || loading)"
      aria-hidden="true"
      :class="[icon, buttonIconVariants({ iconPos, fullWidth, loading })]"
    />
    <span
      v-show="!disabled"
      aria-hidden="true"
      class="z-[-1] block absolute inset-0 pointer-events-none transition-background-color duration-[.2s] ease-in-out"
      :class="{
        'bg-heles': isHovered && ['fill', 'outline'].includes(variant!),
        'bg-jiren': isHovered && variant === 'ghost' && color === 'piccolo',
        'bg-jira': isHovered && variant === 'ghost' && color === 'hit',
        'bg-chichi-60': isHovered && variant === 'ghost' && color === 'chichi',
        'bg-roshi-60': isHovered && variant === 'ghost' && color === 'roshi',
        'bg-krillin-60': isHovered && variant === 'ghost' && color === 'krillin',
      }"
    />
  </Primitive>
</template>
