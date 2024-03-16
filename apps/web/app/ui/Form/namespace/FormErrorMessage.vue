<script lang="ts" setup>
import { toValue } from "vue";
import { ErrorMessage } from "vee-validate";
import { useFormField } from "./useFormField";
import { UIInputHint } from "~ui/Input";

const { name, formMessageId } = useFormField();
</script>

<template>
  <UIInputHint class="text-chichi!">
    <ErrorMessage
      :id="formMessageId"
      :name="toValue(name)"
    />
  </UIInputHint>
</template>
