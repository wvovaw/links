<script setup lang="tsx">
import { UISeparator } from "@links/ui";
import AddBlock from "./controls/add-block.vue";
import SetBackground from "./controls/set-background.vue";
import Save from "./controls/save.vue";
import UndoRedo from "./controls/undo-redo.vue";
import GoBack from "./controls/go-back.vue";

const Separator = defineComponent(() => {
  return () => (
    <>
      <UISeparator orientation="vertical" class="mx-2 md:hidden" />
      <UISeparator orientation="horizontal" class="my-2 hidden md:block" />
    </>
  );
});
</script>

<template>
  <div class="w-16 flex justify-between md:flex-col">
    <div class="flex flex-col items-center justify-center gap-2">
      <AddBlock />
      <SetBackground />
    </div>
    <div class="flex md:flex-col">
      <Separator />
      <div class="flex items-center justify-center gap-1 md:flex-col">
        <UndoRedo />
        <Save />
        <GoBack />
      </div>
    </div>
  </div>
</template>
