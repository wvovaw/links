<script setup lang="ts">
import { useConstructorStore } from "../../../model";
import ActionButton from "./action-button.vue";

defineProps<{
  blockId: string | null;
}>();

const constructorStore = useConstructorStore();
const { removeBlock } = constructorStore;
</script>

<template>
  <ActionButton
    icon="i-lucide:trash"
    @click="removeBlock(blockId)"
  />
</template>
