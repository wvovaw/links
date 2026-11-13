<script setup lang="ts">
import { SelectGroup, type SelectGroupProps } from "reka-ui";
import { type HTMLAttributes, computed } from "vue";

const props = defineProps<
  SelectGroupProps & {
    class?: HTMLAttributes["class"];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SelectGroup class="" :class="props.class" v-bind="delegatedProps">
    <slot />
  </SelectGroup>
</template>
