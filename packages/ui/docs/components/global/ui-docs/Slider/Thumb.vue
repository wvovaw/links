<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UISlider } from "~ui/Slider";
import { UITag } from "~ui/Tag";

const sl = ref([50, 150]);
</script>

<template>
  <PreviewFrame class="gap-5">
    <UISlider v-model="sl" :step="10" :min="0" :max="200" :n-of-thumbs="2">
      <template #thumb-1="{ value }">
        <div class="absolute grid h-5 w-12 place-content-center -left-20px -top-28px">
          <UITag size="xs">
            {{ value }}
          </UITag>
        </div>
      </template>
      <template #thumb-2="{ value }">
        <div class="absolute grid h-5 w-12 place-content-center -bottom-28px -left-20px">
          <UITag size="xs" color="hit">
            {{ value }}
          </UITag>
        </div>
      </template>
    </UISlider>
  </PreviewFrame>
</template>
