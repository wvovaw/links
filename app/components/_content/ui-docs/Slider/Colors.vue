<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISlider } from "~ui/Slider";
</script>

<template>
  <PreviewFrame class="gap-5">
    <UISlider :default-value="[95]" />
    <UISlider :default-value="[75]" color="hit" />
    <UISlider :default-value="[55]" color="chichi" />
    <UISlider :default-value="[35]" color="krillin" />
    <UISlider :default-value="[15]" color="roshi" />
  </PreviewFrame>
</template>
