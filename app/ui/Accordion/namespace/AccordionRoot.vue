<script setup lang="ts">
import { AccordionRoot, type AccordionRootEmits, type AccordionRootProps, useForwardPropsEmits } from "radix-vue";

const props = withDefaults(defineProps<AccordionRootProps>(), {
  type: "single",
  collapsible: true,
});
const emits = defineEmits<AccordionRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <AccordionRoot v-bind="forwarded">
    <slot />
  </AccordionRoot>
</template>
