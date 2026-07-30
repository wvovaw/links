<script setup lang="ts">
import { UIProgressCircular } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
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
