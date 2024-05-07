<script setup lang="ts">
import { UIButton, UITooltip } from "@links/ui";
import { useConstructorStore } from "../../../model";

const { saveCurrentState } = useConstructorStore();
</script>

<template>
  <UITooltip attach-side="right">
    <template #trigger>
      <UIButton icon="i-lucide:save" variant="ghost" @click="saveCurrentState" />
    </template>
    <template #content>
      Save changes
    </template>
  </UITooltip>
</template>
