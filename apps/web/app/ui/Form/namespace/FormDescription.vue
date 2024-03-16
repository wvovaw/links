<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { useFormField } from "./useFormField";
import { UIInputHint } from "~ui/Input";

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
