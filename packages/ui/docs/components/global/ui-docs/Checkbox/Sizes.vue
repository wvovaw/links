<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICheckbox } from "~ui/Checkbox";
</script>

<template>
  <PreviewFrame>
    <UICheckbox id="small" />
    <UICheckbox id="medium" size="md" />
  </PreviewFrame>
</template>
