<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConstructorStore } from "../../../model";
import { useConstructorData } from "../../../model/provider";
import EditBlock from "./edit-block-action.vue";
import DuplicateBlock from "./duplicate-block-action.vue";
import RemoveBlock from "./remove-block-action.vue";

const constructorStore = useConstructorStore();
const { selectedBlockId } = storeToRefs(constructorStore);

const { isMobile } = useConstructorData();
</script>

<template>
  <div class="z-1">
    <div
      class="h-fit w-10 flex"
      :class="{
        'absolute bottom-50% translate-y-50% -left-20 flex-col opacity-60 transition-opacity duration-300 hover:opacity-100 gap-2': !isMobile,
        'absolute bottom-0 right-0 flex-row w-fit translate-y-15 bg-zeno p-2 rounded-moon-i-sm gap-4': isMobile,
      }"
    >
      <EditBlock v-if="isMobile" :block-id="selectedBlockId" />
      <DuplicateBlock :block-id="selectedBlockId" />
      <RemoveBlock :block-id="selectedBlockId" />
    </div>
  </div>
</template>
