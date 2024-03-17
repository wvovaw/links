<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIProgressCircular } from "~ui/Progress";
import { UIButton } from "~ui/Button";

const { count: progress, inc, dec } = useCounter(10, {
  max: 100,
  min: 0,
});
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex flex-row justify-center gap-3">
      <UIProgressCircular v-model="progress" size="xs" />
      <UIProgressCircular v-model="progress" size="sm" color="hit" />
      <UIProgressCircular v-model="progress" size="md" color="chichi" />
      <UIProgressCircular v-model="progress" color="krillin" />
      <UIProgressCircular v-model="progress" size="xl" color="roshi" />
    </div>
    <div class="flex flex-row gap-2">
      <UIButton size="xs" @click="inc(10)">
        +
      </UIButton>
      <span class="w-6 text-center font-mono"> {{ progress }} </span>
      <UIButton size="xs" @click="dec(10)">
        -
      </UIButton>
    </div>
  </PreviewFrame>
</template>
