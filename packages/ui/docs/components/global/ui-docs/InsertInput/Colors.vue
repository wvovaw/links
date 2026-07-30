<script setup lang="ts">
import { UIInsertInput } from "~ui/Input";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UIInsertInput label="Label" color="piccolo" placeholder="Piccolo" />
    <UIInsertInput label="Label" color="hit" placeholder="Hit" />
  </PreviewFrame>
</template>
