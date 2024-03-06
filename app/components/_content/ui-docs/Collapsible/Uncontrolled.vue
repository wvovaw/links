<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UICollapsible, UICollapsibleContent, UICollapsibleTrigger } from "~ui/Collapsible";
</script>

<template>
  <PreviewFrame>
    <UICollapsible class="w-xs">
      <template #default="{ open }">
        <div class="flex flex-row justify-between items-center">
          <span class="text-moon-16 font-bold">Using `open` value provided by slot</span>
          <UICollapsibleTrigger>
            <div class="w-10 h-10 p-1 rounded-moon-i-sm text-moon-18 grid place-content-center cursor-pointer hover:(bg-jiren text-piccolo) transition-colors">
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
