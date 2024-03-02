<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressCircular } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressCircular :model-value="20" />
    <UIProgressCircular :model-value="40" />
    <UIProgressCircular :model-value="60" />
    <UIProgressCircular :model-value="80" />
    <UIProgressCircular :model-value="100" />
  </PreviewFrame>
</template>
