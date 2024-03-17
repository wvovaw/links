<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICheckbox } from "~ui/Checkbox";

const { state, next } = useCycleList(["indeterminate", true, false as const]);
</script>

<template>
  <PreviewFrame>
    <UICheckbox :checked="state" @click="next()" />
  </PreviewFrame>
</template>
