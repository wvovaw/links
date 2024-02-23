<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UIToggle variant="ghost">
        Ghost
      </UIToggle>
      <UIToggle>Default</UIToggle>
    </div>
  </Previewbox>
</template>
