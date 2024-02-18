<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
}

withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    :class="buttonVariants({ variant, size })"
    :as-child="asChild"
    :as="as"
  >
    <slot />
  </Primitive>
</template>
