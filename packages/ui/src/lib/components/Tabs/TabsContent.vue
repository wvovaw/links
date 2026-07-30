<script setup lang="ts">
import { TabsContent, type TabsContentProps } from "radix-vue";
import { type HTMLAttributes, computed } from "vue";

const props = defineProps<TabsContentProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsContent :class="props.class" v-bind="delegatedProps">
    <slot />
  </TabsContent>
</template>
