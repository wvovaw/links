<script setup lang="ts">
import { UISkeleton } from "~ui/Skeleton";

import PreviewFrame from "../PreviewFrame.vue";
</script>

<template>
  <PreviewFrame>
    <UISkeleton class="h-10 w-10 rounded-full" />
  </PreviewFrame>
</template>
