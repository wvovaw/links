<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIToggleGroup, UIToggleGroupItem } from "~ui/ToggleGroup";

const chosenPet = ref<"cat" | "dog" | undefined>();

const msg = computed(() => chosenPet.value ? `You like ${chosenPet.value}s` : "You don't like animals :(");
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-col gap-2">
      <span>{{ msg }}</span>
      <!-- type=single by default -->
      <UIToggleGroup v-model="chosenPet" type="single">
        <UIToggleGroupItem value="cat" icon="i-lucide:cat" />
        <UIToggleGroupItem value="dog" icon="i-lucide:dog" />
      </UIToggleGroup>
    </div>
  </PreviewFrame>
</template>
