<script setup lang="ts">
import { UIToggleGroup, UIToggleGroupItem } from "@links/ui";

import type { StatsRangePreset } from "../model";

const props = defineProps<{ modelValue: StatsRangePreset }>();
const emit = defineEmits<{ "update:modelValue": [value: StatsRangePreset] }>();

const { t } = useI18n();

const presets: StatsRangePreset[] = ["7d", "30d", "all"];
</script>

<template>
  <UIToggleGroup
    :model-value="props.modelValue"
    size="sm"
    @update:model-value="(value) => emit('update:modelValue', (value || props.modelValue) as StatsRangePreset)"
  >
    <UIToggleGroupItem v-for="preset of presets" :key="preset" :value="preset" :data-preset="preset">
      {{ t(`stats.range.${preset}`) }}
    </UIToggleGroupItem>
  </UIToggleGroup>
</template>
