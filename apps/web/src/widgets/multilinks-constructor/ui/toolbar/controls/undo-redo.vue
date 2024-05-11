<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";
import { useConstructorStore } from "../../../model";
import { useKeyboardShortcut } from "~shared/lib/composables";

const constructorStore = useConstructorStore();
const { canUndo, canRedo } = storeToRefs(constructorStore);
const { undo, redo } = constructorStore;

useKeyboardShortcut({ combination: { key: "Z", modifiers: ["Control"] }, handler: undo });
useKeyboardShortcut({ combination: { key: "Y", modifiers: ["Control"] }, handler: redo });
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <div class="flex gap-0.5">
        <UIButton icon="i-lucide:undo" variant="ghost" size="xs" :disabled="!canUndo" @click="undo" />
        <UIButton icon="i-lucide:redo" variant="ghost" size="xs" :disabled="!canRedo" @click="redo" />
      </div>
    </template>
    <template #content>
      Undo / Redo
    </template>
  </UITooltip>
</template>
