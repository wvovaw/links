<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISlider } from "~ui/Slider";
</script>

<template>
  <PreviewFrame>
    <UISlider :default-value="[50]" />
  </PreviewFrame>
</template>
