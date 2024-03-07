<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { UITooltip } from "~ui/Tooltip";
</script>

<template>
  <PreviewFrame>
    <UITooltip>
      <template #trigger>
        <UIButton>Hover me</UIButton>
      </template>
      <template #content>
        I am a tooltip
      </template>
    </UITooltip>
  </PreviewFrame>
</template>
