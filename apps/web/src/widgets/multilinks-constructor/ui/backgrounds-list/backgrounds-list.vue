<script setup lang="ts">
import { BACKGROUND_PRESETS } from "@links/blocks";
import { UIScrollArea, UITag } from "@links/ui";

import { useConstructorStore } from "../../model";

const { setBackground } = useConstructorStore();
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks" class="h-full p-4 pb-10">
    <div class="flex flex-wrap justify-around gap-4">
      <div
        v-for="(value, key) of BACKGROUND_PRESETS"
        :key="key"
        class="relative aspect-3/5 w-22 cursor-pointer border-(1 beerus) rounded-moon-i-sm transition-colors duration-300 hover:(border-bulma)"
        :style="value"
        @click="setBackground(value)"
      >
        <UITag class="absolute bottom-1 right-1">
          {{ key }}
        </UITag>
      </div>
    </div>
  </UIScrollArea>
</template>
