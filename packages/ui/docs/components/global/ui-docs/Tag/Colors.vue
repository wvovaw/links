<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITag } from "~ui/Tag";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex justify-around gap-2">
      <UITag>default</UITag>
      <UITag color="piccolo">
        piccolo
      </UITag>
      <UITag color="hit">
        hit
      </UITag>
      <UITag color="chichi">
        chichi
      </UITag>
      <UITag color="krillin">
        krillin
      </UITag>
      <UITag color="roshi">
        roshi
      </UITag>
    </div>
    <div class="w-full flex justify-around gap-2">
      <UITag variant="outline">
        default
      </UITag>
      <UITag variant="outline" color="piccolo">
        piccolo
      </UITag>
      <UITag variant="outline" color="hit">
        hit
      </UITag>
      <UITag variant="outline" color="chichi">
        chichi
      </UITag>
      <UITag variant="outline" color="krillin">
        krillin
      </UITag>
      <UITag variant="outline" color="roshi">
        roshi
      </UITag>
    </div>
  </PreviewFrame>
</template>
