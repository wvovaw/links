<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITextArea } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UITextArea placeholder="resize both" />
    <UITextArea placeholder="resize horizontal" resize="horizontal" />
    <UITextArea placeholder="resize vertical" resize="vertical" />
  </PreviewFrame>
</template>
