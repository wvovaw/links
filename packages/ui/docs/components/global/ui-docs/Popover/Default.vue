<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { UIPopover, UIPopoverArrow, UIPopoverContent, UIPopoverTrigger } from "~ui/Popover";

import PreviewFrame from "../PreviewFrame.vue";
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
