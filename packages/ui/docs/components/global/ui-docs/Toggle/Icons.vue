<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewBox>
    <h4 class="w-full text-start">
      With icons only
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle size="sm" icon="i-lucide:italic" />
      <UIToggle icon="i-lucide:italic" />
    </div>
    <h4 class="w-full text-start">
      With icons left
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle size="sm" icon="i-lucide:plus">
        SM toggle
      </UIToggle>
      <UIToggle icon="i-lucide:plus">
        MD toggle
      </UIToggle>
    </div>
    <h4 class="w-full text-start">
      With icons right
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle size="sm" icon="i-lucide:check" icon-pos="right">
        SM toggle
      </UIToggle>
      <UIToggle icon="i-lucide:check" icon-pos="right">
        MD toggle
      </UIToggle>
    </div>
  </PreviewBox>
</template>
