<script setup lang="ts">
import { useFetch as vuUseFetch } from "@vueuse/core";

import PreviewFrame from "../PreviewFrame.vue";
import { UIButton } from "~ui/Button";

const { execute: execute1, isFetching: isFetching1, error: error1 } = vuUseFetch("https://httpbin.org/delay/3", { immediate: false });
const { execute: execute2, isFetching: isFetching2, error: error2 } = vuUseFetch("https://httpbin.org/drip?duration=0&numbytes12&code=403&delay=3", { immediate: false });

function handle1() {
  execute1();
}
function handle2() {
  execute2();
}
</script>

<template>
  <PreviewFrame>
    <UIButton loading>
      Loading
    </UIButton>
    <UIButton icon-pos="right" loading>
      Loading right
    </UIButton>
    <UIButton :loading="true" disabled>
      With disabled
    </UIButton>
    <div class="w-full flex flex-col justify-around gap-5">
      <h4 class="w-full">
        Compose example with error animation
      </h4>
      <UIButton
        icon="i-lucide:refresh-cw"
        icon-pos="right"
        :loading="isFetching1"
        :disabled="isFetching1"
        :animation="error1 && 'error'"
        @click="handle1"
      >
        Run async call
      </UIButton>
      <UIButton
        icon="i-lucide:download"
        icon-pos="left"
        :loading="isFetching2"
        :disabled="isFetching2"
        :animation="error2 && 'error'"
        @click="handle2"
      >
        Bad request
      </UIButton>
    </div>
  </PreviewFrame>
</template>
