<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITag } from "~ui/Tag";
</script>

<template>
  <PreviewFrame>
    <UITag icon-left="i-lucide:dog" icon-right="i-lucide:x" @icon-right-click="() => console.log('Right icon clicked!')">
      This is clickable &RightArrow;
    </UITag>
    <UITag icon-left="i-lucide:check" icon-right="i-lucide:cat" @icon-left-click="() => console.log('Left icon clicked!')">
      &LeftArrow; This is clickable
    </UITag>
  </PreviewFrame>
</template>
