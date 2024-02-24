<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIToggleGroup, UIToggleGroupItem } from "~ui/ToggleGroup";

type GameMode = "nightcore" | "x2" | "flashlight";
const gameMode = ref<GameMode[] | undefined>();

const msg = computed(() => Array.isArray(gameMode.value) ? `Game settings: ${gameMode.value.join(", ")}` : "Default game");
</script>

<template>
  <PreviewFrame>
    <span class="w-full text-center">{{ msg }}</span>
    <UIToggleGroup v-model="gameMode" type="multiple">
      <UIToggleGroupItem value="nightcore" icon="i-lucide:music-4" />
      <UIToggleGroupItem value="x2" icon="i-lucide:superscript" />
      <UIToggleGroupItem value="flashlight" icon="i-lucide:siren" />
    </UIToggleGroup>
  </PreviewFrame>
</template>
