<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressBar } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressBar model-value="40" size="xs" />
    <UIProgressBar model-value="40" size="sm" />
    <UIProgressBar model-value="40" size="md" />
    <UIProgressBar model-value="40" />
    <UIProgressBar model-value="40" size="xl" />
  </PreviewFrame>
</template>
