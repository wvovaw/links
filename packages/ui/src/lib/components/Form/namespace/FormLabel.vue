<script lang="ts" setup>
import type { LabelProps } from "reka-ui";
import type { HTMLAttributes } from "vue";

import { UIInputLabel } from "../../Input";
import { useFormField } from "./useFormField";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const { formItemId } = useFormField();
</script>

<template>
  <UIInputLabel :class="props.class" :for="formItemId">
    <slot />
  </UIInputLabel>
</template>
