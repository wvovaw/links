<script setup lang="ts">
import { UIProgressBar } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIProgressBar :model-value="50" />
    <UIProgressBar :model-value="50" color="hit" />
    <UIProgressBar :model-value="50" color="chichi" />
    <UIProgressBar :model-value="50" color="krillin" />
    <UIProgressBar :model-value="50" color="roshi" />
  </PreviewFrame>
</template>
