<script setup lang="ts">
import { UITextArea } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UITextArea placeholder="resize both" />
    <UITextArea placeholder="resize horizontal" resize="horizontal" />
    <UITextArea placeholder="resize vertical" resize="vertical" />
  </PreviewFrame>
</template>
