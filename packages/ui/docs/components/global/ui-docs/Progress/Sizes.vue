<script setup lang="ts">
import { UIProgressBar } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIProgressBar :model-value="40" size="xs" />
    <UIProgressBar :model-value="40" size="sm" />
    <UIProgressBar :model-value="40" size="md" />
    <UIProgressBar :model-value="40" />
    <UIProgressBar :model-value="40" size="xl" />
  </PreviewFrame>
</template>
