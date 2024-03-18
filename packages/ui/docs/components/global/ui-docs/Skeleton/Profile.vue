<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue"
import { UISkeleton } from "~ui/Skeleton";
</script>

<template>
  <PreviewFrame>
    <div class="flex gap-2">
      <UISkeleton class="w-14 h-14 rounded-full!" />
      <div class="flex flex-col gap-2 justify-center">
        <div class="inline-flex gap-2">
          <UISkeleton class="w-24 h-2" />
          <UISkeleton class="w-16 h-2" />
        </div>
        <UISkeleton class="w-16 h-2" />
        <div class="inline-flex gap-2">
          <UISkeleton class="w-6 h-2" />
          <UISkeleton class="w-10 h-2" />
          <UISkeleton class="w-8 h-2" />
        </div>
      </div>
    </div>
  </PreviewFrame>
</template>
