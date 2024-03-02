<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressBar } from "~ui/Progress";
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
