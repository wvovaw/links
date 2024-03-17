<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIToggleGroup, UIToggleGroupItem } from "~ui/ToggleGroup";

const cell = ref();
</script>

<template>
  <PreviewFrame>
    <UIToggleGroup v-model="cell" color="hit" with-stroke class="grid-cols-3 grid-rows-3 gap-3 grid!">
      <UIToggleGroupItem value="1" icon="i-lucide:move-up-left" />
      <UIToggleGroupItem value="2" icon="i-lucide:move-up" />
      <UIToggleGroupItem value="3" icon="i-lucide:move-up-right" />
      <UIToggleGroupItem value="4" icon="i-lucide:move-left" />
      <UIToggleGroupItem value="5" icon="i-lucide:move" />
      <UIToggleGroupItem value="6" icon="i-lucide:move-right" />
      <UIToggleGroupItem value="7" icon="i-lucide:move-down-left" />
      <UIToggleGroupItem value="8" icon="i-lucide:move-down" />
      <UIToggleGroupItem value="9" icon="i-lucide:move-down-right" />
    </UIToggleGroup>
  </PreviewFrame>
</template>
