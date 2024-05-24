<script setup lang="ts">
import { UIScrollArea, UITag } from "@links/ui";
import { useConstructorStore } from "../../model";

const backgrounds = {
  marine: "background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);",
  sunset: "background: linear-gradient(135deg, #ff7e5f, #feb47b);",
  forest: "background: linear-gradient(135deg, #5a3f37, #2c7744);",
  ocean: "background: linear-gradient(135deg, #2e3192, #1bffff);",
  sunrise: "background: linear-gradient(135deg, #f6d365, #fda085);",
  tropical: "background: linear-gradient(135deg, #a8e063, #56ab2f);",
  lavender: "background: linear-gradient(135deg, #e0c3fc, #8ec5fc);",
  autumn: "background: linear-gradient(135deg, #e43a15, #e65245);",
  mint: "background: linear-gradient(135deg, #00d2ff, #3a7bd5);",
  berry: "background: linear-gradient(135deg, #a83279, #d38312);",
  lime: "background: linear-gradient(135deg, #a1ffce, #faffd1);",
  flamingo: "background: linear-gradient(135deg, #f78ca0, #f9748f);",
  twilight: "background: linear-gradient(135deg, #0f2027, #2c5364);",
  coral: "background: linear-gradient(135deg, #ff9966, #ff5e62);",
  sky: "background: linear-gradient(135deg, #89f7fe, #66a6ff);",
  galaxy: "background: linear-gradient(135deg, #232526, #414345);",
  orchid: "background: linear-gradient(135deg, #da22ff, #9733ee);",
  fire: "background: linear-gradient(135deg, #ff4e50, #f9d423);",
  ice: "background: linear-gradient(135deg, #83a4d4, #b6fbff);",
  magma: "background: linear-gradient(135deg, #f00000, #dc281e);",
  desert: "background: linear-gradient(135deg, #c94b4b, #4b134f);",
};

const { setBackground } = useConstructorStore();
</script>

<template>
  <UIScrollArea bar-class="rounded-none" thumb-class="bg-trunks" class="h-full p-4 pb-10">
    <div class="flex flex-wrap justify-around gap-4">
      <div
        v-for="(value, key) of backgrounds"
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
