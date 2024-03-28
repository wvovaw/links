<script setup lang="ts">
import type { BlockProperty } from "~core/types";

const props = defineProps<{
  properties: BlockProperty[];
}>();

const text = computed(() => props.properties.find(el => el.key === "text")?.value);
</script>

<template>
  <p
    class="text-center"
    >{{ text }}</p>
</template>