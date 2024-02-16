<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { useThemeStore } from "~stores/theme.store";

defineProps<{
  iconOnly?: boolean;
}>();

const themeStore = useThemeStore();
const { state } = storeToRefs(themeStore);
const { cycle } = themeStore;
</script>

<template>
  <UIButton class="active:none" @click="cycle">
    <div
      v-if="state === 'light'"
      class="i-lucide:sun-medium w-1.3rem h-1.3rem"
    />
    <div
      v-if="state === 'dark'"
      class="i-lucide:moon w-1.3rem h-1.3rem"
    />
    <div
      v-if="state === 'auto'"
      class="i-lucide:monitor w-1.3rem h-1.3rem"
    />
    <span
      v-if="!iconOnly"
      class="ml-2 capitalize"
    >{{ state }}</span>
  </UIButton>
</template>
