<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import Clear from "./namespace/Clear.vue";
import FileList from "./namespace/FileList.vue";
import Root from "./namespace/Root.vue";
import Trigger from "./namespace/Trigger.vue";

const props = defineProps<{
  modelValue?: File | File[] | null;
  multiple?: boolean;
  accept?: string;
  label?: string;
  resetLabel?: string;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  "update:modelValue": [payload: File | File[] | null];
  "change": [payload: File | File[] | null];
}>();
</script>

<template>
  <Root
    :model-value="props.modelValue"
    :multiple="multiple"
    :accept="accept"
    :class="props.class"
    @update:model-value="(e) => emits('update:modelValue', e)"
    @change="(e) => emits('change', e)"
  >
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <Trigger
          class="inline-flex items-center gap-2 px-4 py-2 rounded-moon-i-sm bg-piccolo text-goten text-moon-14 font-medium hover:bg-piccolo/90 cursor-pointer"
        >
          <span class="i-lucide:upload w-4 h-4" />
          <span>{{ label ?? "Upload File" }}{{ multiple ? "s" : "" }}</span>
        </Trigger>
        <Clear
          class="inline-flex items-center gap-1 px-3 py-2 rounded-moon-i-sm border border-beerus text-trunks text-moon-14 hover:bg-gohan cursor-pointer"
        >
          <span class="i-lucide:refresh-ccw w-3.5 h-3.5" />
          <span>{{ resetLabel ?? "Reset" }}</span>
        </Clear>
      </div>
      <FileList class="flex flex-wrap gap-2">
        <template #default="{ file, remove }">
          <div
            class="flex items-center gap-2 px-3 py-1.5 rounded-moon-i-xs bg-goku border border-beerus text-moon-14 text-bulma whitespace-nowrap max-w-full"
          >
            <span class="i-lucide:file w-4 h-4 shrink-0 text-trunks" />
            <span class="truncate">{{ file.name }}</span>
            <button
              class="i-lucide:x w-3.5 h-3.5 text-trunks hover:text-chichi shrink-0 cursor-pointer"
              @click="remove"
            />
          </div>
        </template>
      </FileList>
    </div>
  </Root>
</template>
