<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
</script>

<template>
  <PreviewFrame>
    <UIInput placeholder="Disabled" disabled />
    <UIInput model-value="Some error text" placeholder="Error" error error-message="I am an error" />
    <UIInput placeholder="Readonly" model-value="Readonly with value" read-only />
  </PreviewFrame>
</template>
