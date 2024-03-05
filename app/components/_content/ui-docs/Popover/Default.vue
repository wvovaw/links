<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIPopover, UIPopoverArrow, UIPopoverContent, UIPopoverTrigger } from "~ui/Popover";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIPopover>
      <UIPopoverTrigger as-child>
        <UIButton>Click me</UIButton>
      </UIPopoverTrigger>
      <UIPopoverContent>
        Hello from the Popover!
        <UIPopoverArrow />
      </UIPopoverContent>
    </UIPopover>
  </PreviewFrame>
</template>
