<script setup lang="ts">
import { TabsRoot, useForwardPropsEmits } from "radix-vue";
import type { TabsRootEmits, TabsRootProps } from "radix-vue";
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
