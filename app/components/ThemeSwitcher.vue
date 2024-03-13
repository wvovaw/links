<script setup lang="ts">
import { UIButton } from "~ui/Button";
import { useThemeStore } from "~stores/theme.store";

defineProps<{
  iconOnly?: boolean;
}>();

const themeStore = useThemeStore();
const { state } = storeToRefs(themeStore);
const { cycle } = themeStore;

const icon = computed(() => {
  if (state.value === "dark")
    return "i-lucide:moon";
  else if (state.value === "light")
    return "i-lucide:sun-medium";
  else // (state.value === "auto");
  return "i-lucide:monitor";
});
</script>

<template>
  <UIButton class="active:none" :icon="icon" @click="cycle">
    <span
      v-if="!iconOnly"
      class="ml-2 capitalize"
    >{{ state }}</span>
  </UIButton>
</template>
