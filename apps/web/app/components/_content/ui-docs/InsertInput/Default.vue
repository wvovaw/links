<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInsertInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UIInsertInput label="Label" placeholder="Placeholder text" />
    <UIInsertInput label="Label" placeholder="Placeholder text" full-width />
  </PreviewFrame>
</template>
