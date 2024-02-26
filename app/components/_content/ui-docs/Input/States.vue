<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UIInput placeholder="Disabled" disabled />
    <UIInput placeholder="Error" error />
    <UIInput placeholder="Readonly" model-value="Readonly with value" read-only />
  </PreviewFrame>
</template>
