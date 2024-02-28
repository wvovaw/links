<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITag } from "~ui/Tag";
</script>

<template>
  <PreviewFrame class="gap-4">
    <div class="w-full flex justify-around">
      <UITag icon-left="i-lucide:box" size="xs">
        xs size
      </UITag>
      <UITag icon-left="i-lucide:box">
        sm size
      </UITag>
    </div>
    <div class="w-full flex justify-around">
      <UITag icon-left="i-lucide:box" variant="outline" size="xs">
        xs size
      </UITag>
      <UITag icon-left="i-lucide:box" variant="outline">
        sm size
      </UITag>
    </div>
    <div class="w-full flex justify-around">
      <UITag icon-right="i-lucide:box" size="xs">
        xs size
      </UITag>
      <UITag icon-right="i-lucide:box">
        sm size
      </UITag>
    </div>
    <div class="w-full flex justify-around">
      <UITag icon-right="i-lucide:box" variant="outline" size="xs">
        xs size
      </UITag>
      <UITag icon-right="i-lucide:box" variant="outline">
        sm size
      </UITag>
    </div>
    <div class="w-full flex justify-around">
      <UITag icon-left="i-lucide:box" icon-right="i-lucide:x" size="xs">
        xs size
      </UITag>
      <UITag icon-left="i-lucide:box" icon-right="i-lucide:x">
        sm size
      </UITag>
    </div>
    <div class="w-full flex justify-around">
      <UITag icon-left="i-lucide:box" icon-right="i-lucide:x" variant="outline" size="xs">
        xs size
      </UITag>
      <UITag icon-left="i-lucide:box" icon-right="i-lucide:x" variant="outline">
        sm size
      </UITag>
    </div>
  </PreviewFrame>
</template>
