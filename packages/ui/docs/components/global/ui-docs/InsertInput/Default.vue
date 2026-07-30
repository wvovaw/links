<script setup lang="ts">
import { UIInsertInput } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIInsertInput label="Label" placeholder="Placeholder text" />
    <UIInsertInput label="Label" placeholder="Placeholder text" full-width />
  </PreviewFrame>
</template>
