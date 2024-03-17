<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICollapsible, UICollapsibleContent, UICollapsibleTrigger } from "~ui/Collapsible";
</script>

<template>
  <PreviewFrame>
    <UICollapsible class="w-xs rounded-moon-s-sm bg-goku p-4">
      <div class="flex flex-row items-center justify-between">
        <span class="text-moon-16 font-bold">Expand this section</span>
        <UICollapsibleTrigger>
          <div class="grid h-10 w-10 cursor-pointer place-content-center rounded-moon-i-sm p-1 text-moon-18 transition-colors hover:(bg-jiren text-piccolo)">
            <span class="i-lucide:chevrons-up-down block" />
          </div>
        </UICollapsibleTrigger>
      </div>
      <UICollapsibleContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet velit recusandae eos ex sint! Nihil nobis qui, veniam distinctio labore possimus, iste esse earum, vero accusantium autem! Sunt sit delectus aspernatur possimus?
      </UICollapsibleContent>
    </UICollapsible>
  </PreviewFrame>
</template>
