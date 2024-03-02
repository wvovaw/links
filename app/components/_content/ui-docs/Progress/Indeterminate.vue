<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressBar } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressBar size="xs" />
    <UIProgressBar size="sm" color="hit" />
    <UIProgressBar size="md" color="chichi" />
    <UIProgressBar color="krillin" />
    <UIProgressBar size="xl" color="roshi" />
  </PreviewFrame>
</template>
