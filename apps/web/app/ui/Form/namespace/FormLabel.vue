<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type { LabelProps } from "radix-vue";
import { useFormField } from "./useFormField";
import { UIInputLabel } from "~ui/Input";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const { formItemId } = useFormField();
</script>

<template>
  <UIInputLabel
    :class="props.class"
    :for="formItemId"
  >
    <slot />
  </UIInputLabel>
</template>
