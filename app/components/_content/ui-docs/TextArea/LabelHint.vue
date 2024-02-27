<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInputHint, UIInputLabel, UITextArea } from "~ui/Input";
</script>

<template>
  <PreviewFrame class="gap-0!">
    <UIInputLabel size="md">
      Leave your thoughts
    </UIInputLabel>
    <UITextArea placeholder="Start typing..." class="w-full" />
    <UIInputHint>Here goes a hint</UIInputHint>
  </PreviewFrame>
</template>
