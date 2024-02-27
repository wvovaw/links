<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TabsContent, type TabsContentProps } from "radix-vue";

const props = defineProps<TabsContentProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsContent
    :class="props.class"
    v-bind="delegatedProps"
  >
    <slot />
  </TabsContent>
</template>
