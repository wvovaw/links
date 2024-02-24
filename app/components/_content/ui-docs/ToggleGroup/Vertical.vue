<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIToggleGroup, UIToggleGroupItem } from "~ui/ToggleGroup";

type Level = "1" | "2" | "3" | "4" | "5";
const mood = ref<Level | undefined>();

const msg = computed(() => mood.value ? `Yor mood rating: ${mood.value}` : "Rate your mood from 1 to 5");
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col gap-2">
      <span class="w-full text-center">{{ msg }}</span>
      <UIToggleGroup v-model="mood" size="sm" orientation="vertical" class="flex-col">
        <UIToggleGroupItem value="1" color="chichi" icon="i-lucide:signal-zero" default-value />
        <UIToggleGroupItem value="2" color="krillin" icon="i-lucide:signal-low" />
        <UIToggleGroupItem value="3" color="piccolo" icon="i-lucide:signal-medium" />
        <UIToggleGroupItem value="4" color="hit" icon="i-lucide:signal-high" />
        <UIToggleGroupItem value="5" color="roshi" icon="i-lucide:signal" />
      </UIToggleGroup>
    </div>
  </PreviewFrame>
</template>
