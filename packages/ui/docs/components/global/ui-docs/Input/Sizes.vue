<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UIInput size="sm" placeholder="sm" />
    <UIInput placeholder="md (default)" />
    <UIInput size="lg" placeholder="lg" />
  </PreviewFrame>
</template>
