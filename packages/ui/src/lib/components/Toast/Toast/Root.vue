<script setup lang="ts">
import type { ToastRootEmits, ToastRootProps } from "radix-vue";
import { ToastRoot, useForwardPropsEmits } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { type VariantProps, cva } from "cva";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-moon-s-md border p-6 pr-8 shadow-moon-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--radix-toast-swipe-end-x] data-[swipe=move]:translate-x-[--radix-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-toast-slide-in-up data-[state=closed]:animate-toast-hide data-[swipe=end]:animate-toast-swipe-out data-[state=open]:sm:animate-toast-slide-in-down",
  {
    variants: {
      variant: {
        default: "border border-beerus bg-goku text-bulma",
        error: "border-2 border-chichi-10 bg-goku text-chichi",
        warning: "border-2 border-krillin-10 bg-goku bg-opacity-90 text-krillin",
        success: "border-2 border-roshi-10 bg-goku text-roshi",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
type ToastVariants = VariantProps<typeof toastVariants>;

interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes["class"];
  variant?: ToastVariants["variant"];
  onOpenChange?: ((value: boolean) => void) | undefined;
}
const props = defineProps<ToastProps>();
const emits = defineEmits<ToastRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="[toastVariants({ variant }), props.class]"
    @update:open="onOpenChange"
  >
    <slot />
  </ToastRoot>
</template>
