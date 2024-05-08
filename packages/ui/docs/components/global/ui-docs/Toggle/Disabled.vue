<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewFrame>
    <h4 class="w-full text-start">
      Default
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle disabled>
        default
      </UIToggle>
      <UIToggle :pressed="true" disabled>
        Pressed
      </UIToggle>
      <UIToggle :pressed="true" disabled with-stroke>
        Pressed with stroke
      </UIToggle>
    </div>

    <h4 class="w-full text-start">
      Ghost
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle variant="ghost" disabled>
        Ghost
      </UIToggle>
      <UIToggle variant="ghost" :pressed="true" disabled>
        Pressed ghost
      </UIToggle>
      <UIToggle variant="ghost" :pressed="true" with-stroke disabled>
        Pressed ghost with stroke
      </UIToggle>
    </div>
  </PreviewFrame>
</template>
