<script setup lang="ts">
import { UIMenu } from "@links/ui";
import { usePageStore } from "../../stores/page.store";
import { blocksList } from "~core/blocks";

const { addBlock } = usePageStore();
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <UIMenu.Item v-for="block of blocksList" :key="block.name" @click="addBlock(block.name)" data-testid="blocks-list-item">
      <UIMenu.Icon icon="i-lucide:circle-plus" />
      <UIMenu.Title class="font-semibold">
        {{ block.name }}
      </UIMenu.Title>
    </UIMenu.Item>
  </div>
</template>
