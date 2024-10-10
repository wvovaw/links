<script setup lang="ts">
import { UIMenu } from "@links/ui";
import { blocksList } from "@links/blocks";
import { useConstructorStore } from "../../model";

const { addBlock } = useConstructorStore();
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <UIMenu.Item
      v-for="block of blocksList"
      :key="block.name"
      data-testid="blocks-list-item"
      @click="addBlock(block.name)"
    >
      <UIMenu.Icon icon="i-lucide:circle-plus" />
      <UIMenu.Title class="font-semibold">
        {{ block.name }}
      </UIMenu.Title>
    </UIMenu.Item>
  </div>
</template>
