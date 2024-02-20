<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";

const [err, toggle] = useToggle(false);
const errAnim = computed(() => err.value ? "error" : null);
</script>

<template>
  <PreviewFrame>
    <UIButton animation="pulse">
      Pulse
    </UIButton>
    <UIButton :animation="errAnim" @click="toggle()">
      {{ err ? "Error" : "Click me" }}
    </UIButton>
  </PreviewFrame>
</template>
