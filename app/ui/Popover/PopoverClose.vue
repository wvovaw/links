<script setup lang="ts">
import type { PopoverCloseProps } from "radix-vue";
import { PopoverClose, useForwardProps } from "radix-vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<PopoverCloseProps>();
const forwarded = useForwardProps(props);
</script>

<template>
  <PopoverClose v-bind="forwarded" />
</template>
