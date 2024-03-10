<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIMenu } from "~ui/Menu";

const sel = ref([]);
</script>

<template>
  <PreviewFrame>
    <code class="w-full h-6">value: {{ sel }}</code>
    <UIMenu.Group v-model="sel" type="multiple" class="w-full">
      <UIMenu.GroupItem value="1">
        <UIMenu.Icon icon="i-lucide:box" />
        <UIMenu.Title>First</UIMenu.Title>
        <UIMenu.Checkbox color="piccolo" />
      </UIMenu.GroupItem>

      <UIMenu.GroupItem value="2">
        <UIMenu.Icon icon="i-lucide:box" />
        <UIMenu.Title>Second</UIMenu.Title>
        <UIMenu.Checkbox color="piccolo" />
      </UIMenu.GroupItem>

      <UIMenu.GroupItem value="3">
        <UIMenu.Icon icon="i-lucide:box" />
        <UIMenu.Title>Third</UIMenu.Title>
        <UIMenu.Checkbox color="piccolo" />
      </UIMenu.GroupItem>
    </UIMenu.Group>
  </PreviewFrame>
</template>
