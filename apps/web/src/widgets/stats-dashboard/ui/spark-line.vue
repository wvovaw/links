<script setup lang="ts">
const props = defineProps<{ values: number[] }>();

/**
 * One point per value, scaled to the series' own peak, in a 100×24 box inset by 2 so the stroke is not
 * clipped at the edges. A series with nothing in it — or nothing on any day — draws the flat baseline:
 * the row keeps its rhythm instead of collapsing, exactly as a sparkline with no shape should read.
 */
const points = computed(() => {
  const peak = Math.max(0, ...props.values);
  const last = Math.max(props.values.length - 1, 1);

  return props.values.map((value, index) => `${(index / last) * 100},${22 - (peak ? (value / peak) * 20 : 0)}`).join(" ");
});
</script>

<template>
  <svg
    class="h-6 w-20"
    viewBox="0 0 100 24"
    preserveAspectRatio="none"
    aria-hidden="true"
    data-spark
    :data-points="points"
  >
    <polyline :points="points" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" />
  </svg>
</template>
