<script setup lang="ts">
import { UIInputHint, UIInputLabel, UITextArea } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame class="gap-0!">
    <UIInputLabel size="md"> Leave your thoughts </UIInputLabel>
    <UITextArea placeholder="Start typing..." class="w-full" />
    <UIInputHint>Here goes a hint</UIInputHint>
  </PreviewFrame>
</template>
