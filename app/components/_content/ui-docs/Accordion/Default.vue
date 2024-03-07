<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAccordion } from "~ui/Accordion";
</script>

<template>
  <PreviewFrame class="h-sm py-10">
    <UIAccordion.Root class="w-sm space-y-2" default-value="item-1">
      <UIAccordion.Item value="item-1">
        <UIAccordion.Trigger>Is it accessible?</UIAccordion.Trigger>
        <UIAccordion.Content>
          Yes. It adheres to the WAI-ARIA design pattern.
        </UIAccordion.Content>
      </UIAccordion.Item>
      <UIAccordion.Item value="item-2">
        <UIAccordion.Trigger>Is it unstyled?</UIAccordion.Trigger>
        <UIAccordion.Content>
          No. It IS styled ;-)
        </UIAccordion.Content>
      </UIAccordion.Item>
    </UIAccordion.Root>
  </PreviewFrame>
</template>
