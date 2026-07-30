<script setup lang="ts">
import { UIProgressCircular } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
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
