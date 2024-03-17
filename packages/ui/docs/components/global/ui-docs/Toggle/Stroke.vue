<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewBox>
    <div class="w-full flex items-center justify-around">
      <UIToggle variant="ghost" with-stroke>
        Ghost with stroke
      </UIToggle>
      <UIToggle with-stroke>
        With stroke
      </UIToggle>
    </div>
  </Previewbox>
</template>
