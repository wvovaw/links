<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UIInput placeholder="default with placeholder" />
    <UIInput placeholder="default full-width with placeholder" full-width />
  </PreviewFrame>
</template>
