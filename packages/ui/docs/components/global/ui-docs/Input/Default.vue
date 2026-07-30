<script setup lang="ts">
import { UIInput } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIInput placeholder="default with placeholder" />
    <UIInput placeholder="default full-width with placeholder" full-width />
  </PreviewFrame>
</template>
