<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressCircular } from "~ui/Progress";
</script>

<template>
  <PreviewFrame>
    <UIProgressCircular size="xs" />
    <UIProgressCircular size="sm" color="hit" />
    <UIProgressCircular size="md" color="chichi" />
    <UIProgressCircular color="krillin" />
    <UIProgressCircular size="xl" color="roshi" />
  </PreviewFrame>
</template>
