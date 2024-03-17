<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICollapsible, UICollapsibleContent, UICollapsibleTrigger } from "~ui/Collapsible";
</script>

<template>
  <PreviewFrame>
    <UICollapsible class="w-xs rounded-moon-s-sm bg-goku p-4">
      <template #default="{ open }">
        <div class="flex flex-row items-center justify-between">
          <span class="text-moon-16 font-bold">Using `open` value provided by slot</span>
          <UICollapsibleTrigger>
            <div class="grid h-10 w-10 cursor-pointer place-content-center rounded-moon-i-sm p-1 text-moon-18 transition-colors hover:(bg-jiren text-piccolo)">
              <span
                class="block transition-transform duration-200"
                :class="[
                  open ? 'i-lucide:x' : 'i-lucide:chevrons-up-down',
                  open && 'rotate-90',
                ]"
              />
            </div>
          </UICollapsibleTrigger>
        </div>
        <UICollapsibleContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos error aperiam explicabo vero sint minus distinctio, reiciendis laborum harum cupiditate veniam ad natus dolore labore ipsam vitae officiis rerum quisquam totam? Distinctio.
        </UICollapsibleContent>
      </template>
    </UICollapsible>
  </PreviewFrame>
</template>
