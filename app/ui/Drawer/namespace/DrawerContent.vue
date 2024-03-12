<script lang="ts" setup>
import { DrawerContent, DrawerOverlay, DrawerPortal } from "vaul-vue";
import type { DialogContentEmits, DialogContentProps } from "radix-vue";
import { useForwardPropsEmits } from "radix-vue";
import type { HtmlHTMLAttributes } from "vue";

const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes["class"] }>();
const emits = defineEmits<DialogContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay
      class="fixed inset-0 bg-zeno z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DrawerContent
      v-bind="forwarded"
      class="fixed inset-x-0 bottom-0 z-50 p-4 mt-24 flex h-auto flex-col rounded-t-moon-s-sm border-t border-beerus bg-goku"
      :class="props.class"
    >
      <div class="mx-auto mb-4 h-1.5 w-[100px] rounded-full bg-beerus" />
      <slot />
    </DrawerContent>
  </DrawerPortal>
</template>
