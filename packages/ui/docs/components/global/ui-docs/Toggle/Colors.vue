<script setup lang="ts">
import PreviewBox from "../PreviewFrame.vue";
import { UIToggle } from "~ui/Toggle";
</script>

<template>
  <PreviewBox>
    <h4 class="w-full text-start">
      Default
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle>Piccolo</UIToggle>
      <UIToggle color="hit">
        Hit
      </UIToggle>
      <UIToggle color="krillin">
        Krillin
      </UIToggle>
      <UIToggle color="roshi">
        Roshi
      </UIToggle>
      <UIToggle color="chichi">
        Chichi
      </UIToggle>
    </div>
    <h4 class="w-full text-start">
      Ghost
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle variant="ghost">
        Piccolo
      </UIToggle>
      <UIToggle variant="ghost" color="hit">
        Hit
      </UIToggle>
      <UIToggle variant="ghost" color="krillin">
        Krillin
      </UIToggle>
      <UIToggle variant="ghost" color="roshi">
        Roshi
      </UIToggle>
      <UIToggle variant="ghost" color="chichi">
        Chichi
      </UIToggle>
    </div>
    <h4 class="w-full text-start">
      With stroke
    </h4>
    <div class="w-full flex items-center justify-around">
      <UIToggle variant="ghost" with-stroke>
        Piccolo
      </UIToggle>
      <UIToggle variant="ghost" color="hit" with-stroke>
        Hit
      </UIToggle>
      <UIToggle variant="ghost" color="krillin" with-stroke>
        Krillin
      </UIToggle>
      <UIToggle variant="ghost" color="roshi" with-stroke>
        Roshi
      </UIToggle>
      <UIToggle variant="ghost" color="chichi" with-stroke>
        Chichi
      </UIToggle>
    </div>
  </Previewbox>
</template>
