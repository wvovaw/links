<script setup lang="ts">
import { UISlider } from "~ui/Slider";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UISlider :default-value="[50]" />
  </PreviewFrame>
</template>
