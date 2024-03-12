<script lang="ts" setup>
import type { HTMLAttributes, InjectionKey } from "vue";
import { provide } from "vue";
import { useId } from "radix-vue";
import { FORM_ITEM_INJECTION_KEY } from "./providers";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
  <div class="mb-4" :class="props.class">
    <slot />
  </div>
</template>
