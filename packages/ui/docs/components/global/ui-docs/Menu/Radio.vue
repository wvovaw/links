<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIMenu } from "~ui/Menu";

const sel = ref();
</script>

<template>
  <PreviewFrame>
    <code class="h-6 w-full">value: {{ sel }}</code>
    <UIMenu.Group v-model="sel" type="single" class="w-full">
      <UIMenu.GroupItem value="d1">
        <UIMenu.Icon icon="i-lucide:box" />
        <UIMenu.Title>One</UIMenu.Title>
        <UIMenu.Radio color="piccolo" />
      </UIMenu.GroupItem>
      <UIMenu.GroupItem value="d2">
        <UIMenu.Icon icon="i-lucide:box" />
        <UIMenu.Title>Two</UIMenu.Title>
        <UIMenu.Radio color="piccolo" />
      </UIMenu.GroupItem>
    </UIMenu.Group>
  </PreviewFrame>
</template>
