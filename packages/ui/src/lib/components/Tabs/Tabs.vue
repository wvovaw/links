<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from "reka-ui";

import { TabsRoot, useForwardPropsEmits } from "reka-ui";
import { provide } from "vue";

const props = defineProps<TabsRootProps>();
const emits = defineEmits<TabsRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

provide("tabs", {
  orientation: props.orientation,
});
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
