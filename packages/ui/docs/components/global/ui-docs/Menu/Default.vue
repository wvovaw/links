<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIMenu } from "~ui/Menu";
</script>

<template>
  <PreviewFrame>
    <UIMenu.Item>
      <UIMenu.Icon icon="i-lucide:frame" />
      <UIMenu.Title>Menu item</UIMenu.Title>
      <UIMenu.Meta>meta</UIMenu.Meta>
    </UIMenu.Item>
  </PreviewFrame>
</template>
