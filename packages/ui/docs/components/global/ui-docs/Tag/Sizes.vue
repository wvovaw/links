<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITag } from "~ui/Tag";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex justify-around gap-2">
      <UITag size="xs">
        xs size
      </UITag>
      <UITag>sm size</UITag>
    </div>
    <div class="w-full flex justify-around gap-2">
      <UITag size="xs" variant="outline">
        xs size
      </UITag>
      <UITag variant="outline">
        sm size
      </UITag>
    </div>
  </PreviewFrame>
</template>
