<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const btnEl = ref<HTMLElement | null>(null);
const isHovered = useElementHover(btnEl);
const sl = useSlots();
const noChildren = !!sl?.default;

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
        xs: "px-2 h-6 py-1 text-moon-12 rounded-moon-i-xs",
        sm: "px-3 h-8 py-1 text-moon-14 rounded-moon-i-sm",
        md: "px-4 h-10 py-2 text-moon-14 rounded-moon-i-sm ",
        lg: "px-4 h-12 py-3 text-moon-16 rounded-moon-i-sm",
        xl: "px-6 h-14 py-4 text-moon-16 rounded-moon-i-md",
      },
      color: {
        piccolo: "",
        hit: "",
        roshi: "",
        chichi: "",
        krillin: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconPos: {
        left: "",
        right: "",
      },
      disabled: {
        true: "opacity-60 cursor-not-allowed",
        false: "",
      },
      loading: {
        true: "",
        false: "",
      },
      animation: {
        error: "animate-error bg-chichi! ring-chichi-60!",
        pulse: "animate-pulse2",
      },
    },
    compoundVariants: [
      {
        disabled: false,
        variant: ["fill", "outline", "ghost"],
        class: "active:scale-90",
      },
      /* Fill buttons */
      {
        variant: ["fill"],
        color: ["piccolo"],
        class: "text-goten bg-piccolo [box-shadow:_0_0_0_0_var(--piccolo)] ring-jiren",
      },
      {
        variant: ["fill"],
        color: ["hit"],
        class: "text-goten bg-hit [box-shadow:_0_0_0_0_var(--hit)] ring-jira",
      },
      {
        variant: ["fill"],
        color: ["chichi"],
        class: "text-popo bg-chichi [box-shadow:_0_0_0_0_var(--chichi)] ring-chichi-60",
      },
      {
        variant: ["fill"],
        color: ["krillin"],
        class: "text-popo bg-krillin [box-shadow:_0_0_0_0_var(--krillin)] ring-krillin-60",
      },
      {
        variant: ["fill"],
        color: ["roshi"],
        class: "text-bulma bg-roshi [box-shadow:_0_0_0_0_var(--roshi)] ring-roshi-60",
      },
      /* Outline buttons */
      {
        variant: ["outline"],
        color: ["piccolo"],
        class: "text-piccolo ring-piccolo",
      },
      {
        variant: ["outline"],
        color: ["hit"],
        class: "text-hit ring-hit",
      },
      {
        variant: ["outline"],
        color: ["chichi"],
        class: "text-chichi ring-chichi",
      },
      {
        variant: ["outline"],
        color: ["krillin"],
        class: "text-krillin ring-krillin",
      },
      {
        variant: ["outline"],
        color: ["roshi"],
        class: "text-roshi ring-roshi",
      },
      /* Ghost buttons (only enabled colored) */
      {
        variant: "ghost",
        color: ["piccolo", "hit", "chichi", "krillin", "roshi"],
        disabled: false,
        class: "hover:text-bulma ring-bulma focus:ring-1px",
      },
      /* Link buttons */
      {
        variant: "link",
        color: "piccolo",
        class: "text-piccolo font-semibold",
      },
      {
        variant: "link",
        color: "hit",
        class: "text-hit font-semibold",
      },
      {
        variant: "link",
        color: "chichi",
        class: "text-chichi font-semibold",
      },
      {
        variant: "link",
        color: "krillin",
        class: "text-krillin font-semibold",
      },
      {
        variant: "link",
        color: "roshi",
        class: "text-roshi font-semibold",
      },
    ],
    defaultVariants: {
      variant: "fill",
      color: "piccolo",
      size: "md",
      iconPos: "left",
      fullWidth: false,
    },
  },
);
type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  color?: ButtonVariants["color"];
  icon?: string;
  iconPos?: ButtonVariants["iconPos"];
  loading?: Extract<ButtonVariants["loading"], boolean>;
  fullWidth?: Extract<ButtonVariants["fullWidth"], boolean>;
  disabled?: Extract<ButtonVariants["disabled"], boolean>;
  animation?: ButtonVariants["animation"];
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "fill",
  size: "md",
  color: "piccolo",
  iconPos: "left",
  // loading: false,
});
</script>

<template>
  <Primitive
    ref="btnEl"
    :class="buttonVariants({ variant, size, color, fullWidth, iconPos, animation, loading, disabled })"
    :as-child="asChild"
    :as="as"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span
      v-if="((icon || loading) && iconPos === 'left')"
      aria-hidden="true"
      :class="[
        loading && iconPos === 'left' ? 'i-lucide:loader animate-spin' : icon,
        {
          'mr-1': noChildren && ['xs', 'sm'].includes(size!),
          'mr-2': noChildren && ['md', 'lg', 'xl'].includes(size!),
          'absolute block start-3': fullWidth,
        },
      ]"
    />
    <slot />
    <span
      v-if="((icon || loading) && iconPos === 'right')"
      aria-hidden="true"
      :class="[
        loading && iconPos === 'right' ? 'i-lucide:loader animate-spin' : icon,
        {
          'ml-1': noChildren && ['xs', 'sm'].includes(size!),
          'ml-2': noChildren && ['md', 'lg', 'xl'].includes(size!),
          'absolute block end-3': fullWidth,
        },
      ]"
    />
    <span
      aria-hidden="true"
      class="z-[-1] block absolute inset-0 pointer-events-none transition-background-color duration-[.2s] ease-in-out"
      :class="{
        'bg-heles': isHovered && ['fill', 'outline'].includes(variant!),

        'bg-jiren': isHovered && variant === 'ghost' && color === 'piccolo',
        'bg-jira': isHovered && variant === 'ghost' && color === 'hit',
        'bg-chichi-10': isHovered && variant === 'ghost' && color === 'chichi',
        'bg-roshi-10': isHovered && variant === 'ghost' && color === 'roshi',
        'bg-krillin-10': isHovered && variant === 'ghost' && color === 'krillin',
      }"
    />
  </Primitive>
</template>
