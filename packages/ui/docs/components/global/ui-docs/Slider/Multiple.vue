<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISlider } from "~ui/Slider";
import { UITag } from "~ui/Tag";

const sl1 = ref([35, 65]);
const sl2 = ref([25, 50, 75]);
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex flex-col items-center justify-between sm:flex-row">
      <div class="w-xs p-2">
        <UITag class="w-fit">
          2 thumbs w/ step 5
        </UITag>
        <p class="pt-2 font-mono">
          {{ sl1 }}
        </p>
      </div>
      <UISlider v-model="sl1" :n-of-thumbs="2" :step="5" />
    </div>

    <div class="w-full flex flex-col items-center justify-between sm:flex-row">
      <div class="w-xs p-2">
        <UITag class="w-fit">
          3 thumbs w/ min steps between = 10
        </UITag>
        <p class="pt-2 font-mono">
          {{ sl2 }}
        </p>
      </div>
      <UISlider v-model="sl2" :n-of-thumbs="3" :min-steps-between-thumbs="10" />
    </div>
  </PreviewFrame>
</template>
