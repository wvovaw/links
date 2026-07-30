<script setup lang="ts">
import { UIProgressBar } from "~ui/Progress";

import PreviewFrame from "../PreviewFrame.vue";
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
