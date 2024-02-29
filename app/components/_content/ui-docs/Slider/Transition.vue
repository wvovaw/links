<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISlider } from "~ui/Slider";

const sl = ref([50]);
</script>

<template>
  <PreviewFrame class="gap-5">
    <UISlider v-model="sl" />
    <UISlider v-model="sl" :step="5" color="hit" />
    <UISlider v-model="sl" :step="10" color="krillin" />
  </PreviewFrame>
</template>
