<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { AccordionContent, type AccordionContentProps } from "radix-vue";

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <AccordionContent
    v-bind="delegatedProps"
    class="bg-goku rounded-moon-s-sm rounded-t-none border-t border-beerus text-moon-14 text-bulma data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
  >
    <div class="p-2" :class="props.class">
      <slot />
    </div>
  </AccordionContent>
</template>
