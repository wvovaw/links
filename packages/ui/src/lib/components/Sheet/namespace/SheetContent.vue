<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DialogClose, DialogContent, type DialogContentEmits, type DialogContentProps, DialogOverlay, DialogPortal, useForwardPropsEmits } from "radix-vue";
import { type VariantProps, cva } from "cva";
import { UIButton } from "../../Button";

defineOptions({
  inheritAttrs: false,
});

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-goku border-beerus p-6 shadow-moon-lg transition ease-in-out data-[state=open]:(animate-in animate-ease-out animate-duration-350) data-[state=closed]:(animate-out animate-duration-200)",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top rounded-b-moon-s-sm",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-moon-s-sm",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm rounded-r-moon-s-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm rounded-l-moon-s-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);
type SheetVariants = VariantProps<typeof sheetVariants>;

const props = defineProps<DialogContentProps & {
  class?: HTMLAttributes["class"];
  side?: SheetVariants["side"];
}>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, side: _s, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-zeno  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      :class="[sheetVariants({ side }), props.class]"
      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot />
      <div class="absolute right-5 top-5 outline-none">
        <DialogClose as-child>
          <UIButton icon="i-lucide:x" size="xs" variant="ghost" class="rounded-full!" />
        </DialogClose>
      </div>
    </DialogContent>
  </DialogPortal>
</template>
