<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISkeleton } from "~ui/Skeleton";
</script>

<template>
  <PreviewFrame>
    <div class="flex gap-2">
      <UISkeleton class="h-14 w-14 rounded-full!" />
      <div class="flex flex-col justify-center gap-2">
        <div class="inline-flex gap-2">
          <UISkeleton class="h-2 w-24" />
          <UISkeleton class="h-2 w-16" />
        </div>
        <UISkeleton class="h-2 w-16" />
        <div class="inline-flex gap-2">
          <UISkeleton class="h-2 w-6" />
          <UISkeleton class="h-2 w-10" />
          <UISkeleton class="h-2 w-8" />
        </div>
      </div>
    </div>
  </PreviewFrame>
</template>
