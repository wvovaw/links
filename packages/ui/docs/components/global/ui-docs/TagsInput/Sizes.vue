<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITagsInput, UITagsInputInput, UITagsInputItem } from "~ui/TagsInput";

const modelValue1 = ref(["Apple", "Banana"]);
const modelValue2 = ref(["Aubergine", "Cabbage"]);
const modelValue3 = ref(["Kari"]);
</script>

<template>
  <PreviewFrame class="grid-cols-3 sm:grid!">
    <UITagsInput v-model="modelValue1" size="sm" full-width>
      <UITagsInputItem v-for="item in modelValue1" :key="item" :value="item" />
      <UITagsInputInput placeholder="Fruits..." />
    </UITagsInput>
    <UITagsInput v-model="modelValue2" full-width>
      <UITagsInputItem v-for="item in modelValue2" :key="item" :value="item" />
      <UITagsInputInput placeholder="Vegetables..." />
    </UITagsInput>
    <UITagsInput v-model="modelValue3" size="lg" full-width>
      <UITagsInputItem v-for="item in modelValue3" :key="item" :value="item" />
      <UITagsInputInput placeholder="Seasonings..." />
    </UITagsInput>
  </PreviewFrame>
</template>
