<script setup lang="ts">
import { PopoverArrow, type PrimitiveProps, useForwardProps } from "reka-ui";

const props = defineProps<PrimitiveProps>();
const forwarded = useForwardProps(props);
</script>

<template>
  <PopoverArrow v-bind="forwarded" class="fill-goku" />
</template>
