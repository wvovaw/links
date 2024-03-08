<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIPagination } from "~ui/Pagination";
</script>

<template>
  <PreviewFrame>
    <UIPagination.Root v-slot="{ page }" :total="10" :items-per-page="1" :sibling-count="1" class="w-full flex justify-between">
      <div class="flex gap-1">
        <UIPagination.First />
        <UIPagination.Prev />
      </div>
      <UIPagination.List>
        {{ page }}
      </UIPagination.List>
      <div class="flex gap-1">
        <UIPagination.Next />
        <UIPagination.Last />
      </div>
    </UIPagination.Root>
  </PreviewFrame>
</template>
