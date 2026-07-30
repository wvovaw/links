<script setup lang="ts">
import { UICheckbox } from "~ui/Checkbox";

import PreviewFrame from "../PreviewFrame.vue";

const { state, next } = useCycleList(["indeterminate", true, false as const]);
</script>

<template>
  <PreviewFrame>
    <UICheckbox :checked="state" @click="next()" />
  </PreviewFrame>
</template>
