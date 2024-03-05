<script setup lang="ts">
import { PopoverArrow, type PrimitiveProps, useForwardProps } from "radix-vue";

const props = defineProps<PrimitiveProps>();
const forwarded = useForwardProps(props);
</script>

<template>
  <PopoverArrow v-bind="forwarded" />
</template>
