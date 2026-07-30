<script setup lang="ts">
import { UIInput } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIInput size="sm" placeholder="sm" />
    <UIInput placeholder="md (default)" />
    <UIInput size="lg" placeholder="lg" />
  </PreviewFrame>
</template>
