<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";
import { UITooltip } from "~ui/Tooltip";
</script>

<template>
  <PreviewFrame>
    <UITooltip content-class="bg-krillin-60 text-krillin border border-krillin" arrow-class="fill-krillin">
      <template #trigger>
        <UIButton>Hover me</UIButton>
      </template>
      <template #content>
        Customized tooltip content
      </template>
    </UITooltip>
  </PreviewFrame>
</template>
