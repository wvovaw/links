<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITagsInput, UITagsInputInput, UITagsInputItem } from "~ui/TagsInput";

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
