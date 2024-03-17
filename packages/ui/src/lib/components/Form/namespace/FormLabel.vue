<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type { LabelProps } from "radix-vue";
import { UIInputLabel } from "../../Input";
import { useFormField } from "./useFormField";

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
