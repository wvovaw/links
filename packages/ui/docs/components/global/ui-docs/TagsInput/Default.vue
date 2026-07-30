<script setup lang="ts">
import { UITagsInput, UITagsInputInput, UITagsInputItem } from "~ui/TagsInput";

import PreviewFrame from "../PreviewFrame.vue";

const modelValue = ref(["Apple", "Banana"]);
</script>

<template>
  <PreviewFrame>
    <UITagsInput v-model="modelValue">
      <UITagsInputItem v-for="item in modelValue" :key="item" :value="item" />
      <UITagsInputInput placeholder="Fruits..." />
    </UITagsInput>
  </PreviewFrame>
</template>
