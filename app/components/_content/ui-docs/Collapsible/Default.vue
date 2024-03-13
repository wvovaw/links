<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICollapsible, UICollapsibleContent, UICollapsibleTrigger } from "~ui/Collapsible";
</script>

<template>
  <PreviewFrame>
    <UICollapsible class="w-xs bg-goku p-4 rounded-moon-s-sm">
      <div class="flex flex-row justify-between items-center">
        <span class="text-moon-16 font-bold">Expand this section</span>
        <UICollapsibleTrigger>
          <div class="w-10 h-10 p-1 rounded-moon-i-sm text-moon-18 grid place-content-center cursor-pointer hover:(bg-jiren text-piccolo) transition-colors">
            <span class="block i-lucide:chevrons-up-down" />
          </div>
        </UICollapsibleTrigger>
      </div>
      <UICollapsibleContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet velit recusandae eos ex sint! Nihil nobis qui, veniam distinctio labore possimus, iste esse earum, vero accusantium autem! Sunt sit delectus aspernatur possimus?
      </UICollapsibleContent>
    </UICollapsible>
  </PreviewFrame>
</template>
