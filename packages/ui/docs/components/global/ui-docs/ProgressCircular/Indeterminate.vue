<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressCircular } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressCircular :model-value="null" size="xs" />
    <UIProgressCircular :model-value="null" size="sm" color="hit" />
    <UIProgressCircular :model-value="null" size="md" color="chichi" />
    <UIProgressCircular :model-value="null" color="krillin" />
    <UIProgressCircular :model-value="null" size="xl" color="roshi" />
  </PreviewFrame>
</template>
