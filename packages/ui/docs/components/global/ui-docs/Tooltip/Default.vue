<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { UITooltip } from "~ui/Tooltip";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UITooltip>
      <template #trigger>
        <UIButton>Hover me</UIButton>
      </template>
      <template #content> I am a tooltip </template>
    </UITooltip>
  </PreviewFrame>
</template>
