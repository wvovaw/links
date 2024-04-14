<script setup lang="ts">
import { UIButton } from "@links/ui";
import { getThemeIcon, useThemeStore } from "~entities/ui-theme";

defineProps<{
  iconOnly?: boolean;
}>();

const themeStore = useThemeStore();
const { state } = storeToRefs(themeStore);
const { cycle } = themeStore;

const icon = computed(() =>
  getThemeIcon(state.value),
);
</script>

<template>
  <UIButton v-if="!!iconOnly" class="active:none" :icon="icon" @click="cycle" />
  <UIButton v-else class="active:none" :icon="icon" @click="cycle">
    <span
      class="ml-2 capitalize"
    >{{ state }}</span>
  </UIButton>
</template>
