<script setup lang="ts">
import { UIProgressCircular } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIProgressCircular :model-value="50" />
    <UIProgressCircular :model-value="50" color="hit" />
    <UIProgressCircular :model-value="50" color="chichi" />
    <UIProgressCircular :model-value="50" color="krillin" />
    <UIProgressCircular :model-value="50" color="roshi" />
  </PreviewFrame>
</template>
