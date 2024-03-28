<script setup lang="ts">
import type { BlockProperty } from "~core/types";

const props = defineProps<{
  properties: BlockProperty[];
}>();

const text = computed(() => props.properties.find(el => el.key === "text")?.value);
const link = computed(() => props.properties.find(el => el.key === "link")?.value);
</script>

<template>
  <a
    class="w-full rounded-moon-i-sm bg-frieza px-8 py-4 text-center text-goten font-bold"
    :href="link"
    target="_blank"
  >{{ text }}</a>
</template>
