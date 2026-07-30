<script setup lang="ts">
import { UIRadioGroup, UIRadioGroupItem } from "~ui/RadioGroup";

import PreviewFrame from "../PreviewFrame.vue";

const chosenPet = ref<"cat" | "dog" | undefined>();

const msg = computed(() => (chosenPet.value ? `You like ${chosenPet.value}s` : "You like dogs or cats?"));
</script>

<template>
  <PreviewFrame>
    <span class="w-full text-center">{{ msg }}</span>
    <UIRadioGroup v-model="chosenPet">
      <UIRadioGroupItem value="cat" />
      <UIRadioGroupItem value="dog" />
    </UIRadioGroup>
  </PreviewFrame>
</template>
