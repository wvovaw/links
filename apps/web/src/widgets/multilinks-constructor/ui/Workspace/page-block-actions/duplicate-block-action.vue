<script setup lang="ts">
import { useConstructorStore } from "../../../model";
import ActionButton from "./action-button.vue";

defineProps<{
  blockId: string | null;
}>();

const constructorStore = useConstructorStore();
const { duplicateBlock } = constructorStore;
</script>

<template>
  <ActionButton
    icon="i-lucide:copy"
    @click="duplicateBlock(blockId)"
  />
</template>
