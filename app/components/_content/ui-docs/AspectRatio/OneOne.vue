<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAspectRatio } from "~ui/AspectRatio";
</script>

<template>
  <PreviewFrame>
    <div class="w-sm">
      <UIAspectRatio :ratio="1 / 1" class="bg-heles rounded-moon-s-md overflow-hidden">
        <img
          class="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1709603945846-6901ed447ecd?w=920"
          alt="Photo by Marek Piwnicki on Unsplash"
        >
      </UIAspectRatio>
    </div>
  </PreviewFrame>
</template>
