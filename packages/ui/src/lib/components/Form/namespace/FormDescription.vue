<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { UIInputHint } from "../../Input";
import { useFormField } from "./useFormField";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { formDescriptionId } = useFormField();
</script>

<template>
  <UIInputHint
    :id="formDescriptionId"
    :class="props.class"
  >
    <slot />
  </UIInputHint>
</template>
