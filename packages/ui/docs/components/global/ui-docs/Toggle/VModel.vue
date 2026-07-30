<script setup lang="ts">
import { UIToggle } from "~ui/Toggle";

import PreviewBox from "../PreviewFrame.vue";

const [state] = useToggle();
</script>

<template>
  <PreviewBox>
    <div class="w-full flex items-center justify-around">
      <UIToggle v-model:pressed="state" size="sm" icon="i-lucide:italic" />
      <UIToggle v-model:pressed="state" icon="i-lucide:italic" />
    </div>
  </PreviewBox>
</template>
