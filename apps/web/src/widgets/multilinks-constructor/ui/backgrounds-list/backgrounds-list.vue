<script setup lang="ts">
import { UIScrollArea, UITag } from "@links/ui";
import { useConstructorStore } from "../../model";

const backgrounds = {
  nord: "background: linear-gradient(135deg, #5e81ac, #88c0d0);",
  peach: "background: linear-gradient(135deg, #ffb3b3, #ff9999);",
  marine: "background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);",
  sunset: "background: linear-gradient(135deg, #ff7e5f, #feb47b);",
  forest: "background: linear-gradient(135deg, #5a3f37, #2c7744);",
  ocean: "background: linear-gradient(135deg, #2e3192, #1bffff);",
  sunrise: "background: linear-gradient(135deg, #f6d365, #fda085);",
  aurora: "background: linear-gradient(135deg, #00c6ff, #0072ff);",
  tropical: "background: linear-gradient(135deg, #a8e063, #56ab2f);",
  lavender: "background: linear-gradient(135deg, #e0c3fc, #8ec5fc);",
  autumn: "background: linear-gradient(135deg, #e43a15, #e65245);",
  mint: "background: linear-gradient(135deg, #00d2ff, #3a7bd5);",
};

const { setBackground } = useConstructorStore();
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks" class="h-full p-4">
    <div class="flex flex-wrap justify-around gap-4">
      <div
        v-for="(value, key) of backgrounds"
        :key="key"
        class="relative aspect-3/5 w-22 cursor-pointer border-(1 beerus) rounded-moon-i-sm"
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
