<script setup lang="ts">
import { AccordionItem, type AccordionItemProps, useForwardProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";

const props = defineProps<
  AccordionItemProps & {
    class?: HTMLAttributes["class"];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <AccordionItem v-bind="forwardedProps" class="w-full" :class="props.class">
    <slot />
  </AccordionItem>
</template>
