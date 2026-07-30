<script setup lang="ts">
import { AvatarImage, type AvatarImageProps, useForwardProps } from "radix-vue";
import { type HTMLAttributes, computed } from "vue";

const props = defineProps<
  AvatarImageProps & {
    class?: HTMLAttributes["class"];
  }
>();
const delegatedProps = computed(() => {
  const { class: _cl, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <AvatarImage v-bind="forwardedProps" class="object-cover h-full w-full" :class="props.class" />
</template>
