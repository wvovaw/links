<script setup lang="ts">
import { UISeparator } from "@links/ui";
import AddBlock from "./controls/add-block.vue";
import Save from "./controls/save.vue";
import UndoRedo from "./controls/undo-redo.vue";
</script>

<template>
  <div class="w-16 flex justify-between md:flex-col">
    <div class="inline-flex items-center justify-center">
      <AddBlock />
    </div>
    <div>
      <UISeparator orientation="vertical" class="mx-2 md:hidden" />
      <UISeparator orientation="horizontal" class="my-2 hidden md:block" />
      <div class="flex items-center justify-center gap-1 md:flex-col">
        <UndoRedo />
        <Save />
      </div>
    </div>
  </div>
</template>
