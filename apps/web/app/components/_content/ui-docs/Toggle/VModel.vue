<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";

const [state] = useToggle();
</script>

<template>
  <PreviewBox>
    <div class="w-full flex justify-around items-center">
      <UIToggle v-model:pressed="state" size="sm" icon="i-lucide:italic" />
      <UIToggle v-model:pressed="state" icon="i-lucide:italic" />
    </div>
  </PreviewBox>
</template>
