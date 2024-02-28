<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITag } from "~ui/Tag";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex gap-2 justify-around">
      <UITag size="xs">
        xs size
      </UITag>
      <UITag>sm size</UITag>
    </div>
    <div class="w-full flex gap-2 justify-around">
      <UITag size="xs" variant="outline">
        xs size
      </UITag>
      <UITag variant="outline">
        sm size
      </UITag>
    </div>
  </PreviewFrame>
</template>
