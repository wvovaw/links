<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type VariantProps, cva } from "cva";

const btnEl = ref<HTMLElement | null>(null);
const isHovered = useElementHover(btnEl);

const buttonVariants = cva(
  "relative z-0 flex justify-center items-center font-medium no-underline overflow-hidden whitespace-nowrap select-none transition duration-200",
  {
    variants: {
      variant: {
        fill: "",
        outline: "text-bulma bg-transparent ring-inset ring-1 ring-trunks focus:ring-bulma",
        ghost: "text-trunks bg-transparent hover:text-bulma",
        link: "text-bulma bg-transparent ring-none underline-offset-4 hover:underline",
      },
      size: {
        xs: "px-2 h-6 py-1 text-moon-12 rounded-moon-i-xs",
        sm: "px-3 h-8 py-1 text-moon-14 rounded-moon-i-sm",
        md: "px-4 h-10 py-2 text-moon-14 rounded-moon-i-sm ",
        lg: "px-4 h-12 py-3 text-moon-16 rounded-moon-i-sm",
        xl: "px-6 h-14 py-4 text-moon-16 rounded-moon-i-md",
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
        true: "opacity-60 text-goten cursor-not-allowed",
        false: "active:scale-90",
      },
      animation: {
        progres: "",
        success: "",
        error: "",
        pulse: "",
      },
    },
    compoundVariants: [
      {
        variant: ["fill"],
        class: "text-goten bg-piccolo",
      },
    ],
    defaultVariants: {
      variant: "fill",
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
  icon?: string;
  iconPos?: ButtonVariants["iconPos"];
  fullWidth?: Extract<ButtonVariants["fullWidth"], boolean>;
  disabled?: Extract<ButtonVariants["disabled"], boolean>;
  animation?: ButtonVariants["animation"];
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
  as: "button",
  variant: "fill",
  size: "md",
  iconPos: "left",
  fullWidth: false,
});
</script>

<template>
  <Primitive
    ref="btnEl"
    :class="buttonVariants({ variant, size, fullWidth, iconPos, animation, disabled })"
    :as-child="asChild"
    :as="as"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <!-- TODO: Change icon size and margins depending on props.size -->
    <span
      v-if="icon && iconPos === 'left'"
      aria-hidden="true"
      :class="[icon, {
        'mr-1': ['xs', 'sm'].includes(size!),
        'mr-2': ['md', 'lg', 'xl'].includes(size!),
        'absolute block start-3': fullWidth,
      }]"
    />
    <slot />
    <span
      v-if="icon && iconPos === 'right'"
      aria-hidden="true"
      :class="[icon, {
        'ml-1': ['xs', 'sm'].includes(size!),
        'mr-2': ['md', 'lg', 'xl'].includes(size!),
        'absolute block end-3': fullWidth,
      }]"
    />
    <span
      aria-hidden="true"
      class="z-[-1] block absolute inset-0 pointer-events-none transition-background-color duration-[.2s] ease-in-out"
      :class="{
        'bg-jiren': isHovered && variant === 'ghost',
        'bg-heles': isHovered && !['link', 'ghost'].includes(variant!),
      }"
    />
  </Primitive>
</template>
