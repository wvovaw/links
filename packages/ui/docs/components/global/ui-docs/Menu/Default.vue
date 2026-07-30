<script setup lang="ts">
import { UIMenu } from "~ui/Menu";

import PreviewFrame from "../PreviewFrame.vue";
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
