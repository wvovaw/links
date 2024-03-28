<script setup lang="ts">
import type { Component } from "vue";
import type { IPage } from "~core/types";

interface IPageRendererProps {
  page: IPage;
}
const props = defineProps<IPageRendererProps>();

const blocks: Record<string, Component> = { };

for (const block of props.page.blocks)
  blocks[block.name] = defineAsyncComponent(() => import(`./blocks/${block.name}Block.vue`));
</script>

<template>
  <div class="grow from-pink-300 via-purple-300 to-indigo-400 bg-gradient-to-t pt-10">
    <div class="w-full flex flex-col items-center gap-4 p-2">
      <component
        :is="blocks[block.name]"
        v-for="block of props.page.blocks"
        :key="block.id"
        :properties="block.properties"
      />
    </div>
  </div>
</template>
