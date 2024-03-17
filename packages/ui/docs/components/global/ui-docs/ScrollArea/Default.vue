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
      <UIScrollArea class="w-[200px] h-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm">
        <div class="w-full h-[2000px] bg-gradient-to-b from-pink-600 via-orange-600 to-violet-700" />
      </UIScrollArea>
    </div>

    <div>
      <p class="font-italic">
        Horizontal scroll &RightArrowLeftArrow; <span>type: scroll</span>
      </p>
      <UIScrollArea class="w-[200px] h-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm" type="scroll">
        <div class="w-[2000px] h-[198px] bg-gradient-to-r from-pink-400 via-indigo-600 to-fuchsia-600" />
      </UIScrollArea>
    </div>

    <div>
      <p class="font-italic">
        Both scroll &searrow; <span>type: always</span>
      </p>
      <UIScrollArea class="w-[200px] h-[200px] border-(1 beerus) rounded-moon-s-sm shadow-moon-sm" type="always">
        <div class="w-[2000px] h-[2000px] bg-gradient-to-r from-emerald-500 to-lime-600" />
      </UIScrollArea>
    </div>
  </PreviewFrame>
</template>
