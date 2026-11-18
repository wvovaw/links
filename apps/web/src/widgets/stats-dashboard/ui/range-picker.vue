<script setup lang="ts">
import { UISelect } from "@links/ui";

import type { StatsRangePreset } from "../model";

const props = defineProps<{ modelValue: StatsRangePreset }>();
const emit = defineEmits<{ "update:modelValue": [value: StatsRangePreset] }>();

const { t } = useI18n();

const presets: StatsRangePreset[] = ["7d", "30d", "all"];
</script>

<template>
  <div class="w-40">
    <UISelect
      size="sm"
      data-testid="stats-range"
      :aria-label="t('stats.range.label')"
      :model-value="props.modelValue"
      @update:model-value="(value) => emit('update:modelValue', value as StatsRangePreset)"
    >
      <option v-for="preset of presets" :key="preset" :value="preset">{{ t(`stats.range.${preset}`) }}</option>
    </UISelect>
  </div>
</template>
