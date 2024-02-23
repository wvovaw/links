<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UIToggle size="sm">
        SM toggle
      </UIToggle>
      <UIToggle>MD toggle</UIToggle>
    </div>
  </Previewbox>
</template>
