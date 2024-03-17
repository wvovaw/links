<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIScrollArea } from "~ui/ScrollArea";
</script>

<template>
  <PreviewFrame>
    <div>
      <p class="font-italic">
        Vertical scroll &UpArrowDownArrow; <span>type: hover</span>
      </p>
      <UIScrollArea class="h-[200px] w-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm">
        <div class="h-[2000px] w-full from-pink-600 via-orange-600 to-violet-700 bg-gradient-to-b" />
      </UIScrollArea>
    </div>

    <div>
      <p class="font-italic">
        Horizontal scroll &RightArrowLeftArrow; <span>type: scroll</span>
      </p>
      <UIScrollArea class="h-[200px] w-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm" type="scroll">
        <div class="h-[198px] w-[2000px] from-pink-400 via-indigo-600 to-fuchsia-600 bg-gradient-to-r" />
      </UIScrollArea>
    </div>

    <div>
      <p class="font-italic">
        Both scroll &searrow; <span>type: always</span>
      </p>
      <UIScrollArea class="h-[200px] w-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm" type="always">
        <div class="h-[2000px] w-[2000px] from-emerald-500 to-lime-600 bg-gradient-to-r" />
      </UIScrollArea>
    </div>
  </PreviewFrame>
</template>
