<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <div class="flex gap-0.5">
        <UIButton icon="i-lucide:undo" variant="ghost" size="xs" />
        <UIButton icon="i-lucide:redo" variant="ghost" size="xs" />
      </div>
    </template>
    <template #content>
      Undo / Redo
    </template>
  </UITooltip>
</template>
