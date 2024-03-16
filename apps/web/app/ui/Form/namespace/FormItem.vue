<script lang="ts" setup>
import type { PrimitiveProps } from "radix-vue";
import { Primitive, useForwardProps, useId } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { provide } from "vue";
import { FORM_ITEM_INJECTION_KEY } from "./providers";

const props = defineProps<PrimitiveProps & {
  class?: HTMLAttributes["class"];
}>();
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardProps(delegatedProps);

const id = useId();
provide(FORM_ITEM_INJECTION_KEY, id);
</script>

<template>
  <Primitive
    :class="props.class"
    v-bind="forwarded"
  >
    <slot />
  </Primitive>
</template>
