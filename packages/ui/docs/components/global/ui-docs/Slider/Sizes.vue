<script setup lang="ts">
import { UISlider } from "~ui/Slider";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame class="gap-5">
    <UISlider :default-value="[75]" size="sm" />
    <UISlider :default-value="[55]" />
    <UISlider :default-value="[35]" size="lg" />
  </PreviewFrame>
</template>
