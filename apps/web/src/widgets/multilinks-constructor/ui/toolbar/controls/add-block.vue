<script setup lang="ts">
import type { BlockName } from "@links/blocks";

import { UIButton, UISheet, UITooltip } from "@links/ui";

import { useConstructorStore } from "../../../model";
import { BlocksList } from "../../blocks-list";

const { addBlock } = useConstructorStore();
const [show, setShow] = useToggle();

/** Made obsolete by the workspace palette in the next task. */
function pickBlock(name: BlockName) {
  addBlock(name);
  setShow(false);
}
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <UIButton icon="i-lucide:square-plus" @click="setShow(true)" />
    </template>
    <template #content> Add a block </template>
  </UITooltip>
  <UISheet.Root v-model:open="show">
    <UISheet.Content side="left">
      <UISheet.Header>
        <UISheet.Title>Add Block</UISheet.Title>
        <UISheet.Subtitle>Select a block to add</UISheet.Subtitle>
      </UISheet.Header>
      <BlocksList @select="pickBlock" />
    </UISheet.Content>
  </UISheet.Root>
</template>
