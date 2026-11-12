<script setup lang="ts">
import type { PopoverCloseProps } from "reka-ui";

import { PopoverClose, useForwardProps } from "reka-ui";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<PopoverCloseProps>();
const forwarded = useForwardProps(props);
</script>

<template>
  <PopoverClose v-bind="forwarded" />
</template>
