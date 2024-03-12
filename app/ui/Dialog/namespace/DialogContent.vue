<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { DialogContentEmits, DialogContentProps } from "radix-vue";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "radix-vue";
import { UIButton } from "~ui/Button";

const props = defineProps<DialogContentProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogContent
      v-bind="forwarded"
      class="fixed left-1/2 top-1/2 z-60 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-beerus bg-goku p-6 shadow-moon-lg duration-200 sm:rounded-moon-s-lg
      data-[state=open]:(animate-in fade-in-0 zoom-in-95 slide-in-left-1/2 slide-in-top-1/2)
      data-[state=closed]:(animate-out fade-out-0 zoom-out-95 slide-out-left-1/2 slide-out-top-1/2)"
      style="pointer-events: auto;"
      :class="props.class"
    >
      <slot />

      <div class="absolute right-5 top-5 outline-none">
        <DialogClose as-child>
          <UIButton icon="i-lucide:x" size="xs" variant="ghost" class="rounded-full!" />
        </DialogClose>
      </div>
    </DialogContent>
    <DialogOverlay
      class="fixed inset-0 bg-zeno z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
  </DialogPortal>
</template>
