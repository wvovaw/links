<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressCircular } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressCircular :model-value="40" size="xs" />
    <UIProgressCircular :model-value="40" size="sm" />
    <UIProgressCircular :model-value="40" size="md" />
    <UIProgressCircular :model-value="40" />
    <UIProgressCircular :model-value="40" size="xl" />
  </PreviewFrame>
</template>
