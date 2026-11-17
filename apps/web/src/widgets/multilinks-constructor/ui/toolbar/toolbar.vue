<script setup lang="tsx">
import { UIButton, UISeparator, UITooltip } from "@links/ui";

import type { PanelViewId } from "../../model/provider";

import { PROPERTY_VIEWS } from "../properties-panel/views";
import GoBack from "./controls/go-back.vue";
import Save from "./controls/save.vue";
import UndoRedo from "./controls/undo-redo.vue";

defineProps<{ activeViewId: PanelViewId }>();
const emit = defineEmits<{ select: [view: PanelViewId] }>();

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
    <div class="flex items-center justify-center gap-2 md:flex-col">
      <UITooltip v-for="view of PROPERTY_VIEWS" :key="view.id" attach-side="right">
        <template #trigger>
          <UIButton
            :icon="view.icon"
            :variant="view.id === activeViewId ? 'fill' : 'ghost'"
            :aria-label="view.label"
            :aria-pressed="view.id === activeViewId"
            data-testid="property-view-button"
            @click="emit('select', view.id)"
          />
        </template>
        <template #content> {{ view.label }} </template>
      </UITooltip>
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
