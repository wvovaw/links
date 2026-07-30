<script setup lang="ts">
import { UIProgressBar } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIProgressBar :model-value="0" />
    <UIProgressBar :model-value="20" />
    <UIProgressBar :model-value="40" />
    <UIProgressBar :model-value="60" />
    <UIProgressBar :model-value="80" />
    <UIProgressBar :model-value="100" />
  </PreviewFrame>
</template>
