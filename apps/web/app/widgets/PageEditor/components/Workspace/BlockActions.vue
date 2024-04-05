<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePageStore } from "../../stores/page.store";

const pageStore = usePageStore();
const { selectedBlockId } = storeToRefs(pageStore);
const { duplicateBlock } = pageStore;
</script>

<template>
  <div class="absolute bottom-50% h-fit w-10 translate-y-50% opacity-60 transition-opacity duration-300 -left-18 hover:opacity-100">
    <button
      class="h-10 w-10 flex items-center justify-center border-(1 beerus) rounded-full bg-heles text-trunks outline-beerus"
      @click="duplicateBlock(selectedBlockId)"
    >
      <div class="i-lucide:copy-plus" />
    </button>
  </div>
</template>
