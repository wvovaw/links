<script setup lang="ts">
import { UIToggleGroup, UIToggleGroupItem } from "~ui/ToggleGroup";

import PreviewFrame from "../PreviewFrame.vue";

const chosenPet = ref<"cat" | "dog" | undefined>();

const msg = computed(() => (chosenPet.value ? `You like ${chosenPet.value}s` : "You don't like animals :("));
</script>

<template>
  <PreviewFrame>
    <span class="w-full text-center">{{ msg }}</span>
    <UIToggleGroup v-model="chosenPet" type="single">
      <UIToggleGroupItem value="cat" icon="i-lucide:cat" />
      <UIToggleGroupItem value="dog" icon="i-lucide:dog" />
    </UIToggleGroup>
  </PreviewFrame>
</template>
