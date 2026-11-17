<script setup lang="ts">
import { UIButton } from "@links/ui";

import type { StatsRangePreset } from "../model";

const props = defineProps<{ modelValue: StatsRangePreset }>();
const emit = defineEmits<{ "update:modelValue": [value: StatsRangePreset] }>();

const { t } = useI18n();

const presets: StatsRangePreset[] = ["7d", "30d", "all"];
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UIButton
      v-for="preset of presets"
      :key="preset"
      size="xs"
      :variant="preset === props.modelValue ? 'fill' : 'ghost'"
      :aria-pressed="preset === props.modelValue"
      :data-preset="preset"
      @click="emit('update:modelValue', preset)"
    >
      {{ t(`stats.range.${preset}`) }}
    </UIButton>
  </div>
</template>
