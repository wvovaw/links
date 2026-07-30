<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import Dropzone from "./namespace/Dropzone.vue";
import FileList from "./namespace/FileList.vue";
import Root from "./namespace/Root.vue";

const props = defineProps<{
  modelValue?: File | File[] | null;
  multiple?: boolean;
  accept?: string;
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
    class="flex flex-col gap-3"
    @update:model-value="(e) => emits('update:modelValue', e)"
    @change="(e) => emits('change', e)"
  >
    <Dropzone v-slot="{ isOver }">
      <div
        class="p-4 w-full grid place-content-center border-2 border-dashed rounded-moon-s-sm min-h-32 cursor-pointer bg-gohan"
        :class="[isOver ? 'border-piccolo' : 'border-beerus']"
      >
        <div class="flex flex-col gap-3 items-center">
          <span class="i-lucide:file-plus w-10 h-10 text-trunks" />
          <div class="flex flex-col items-center gap-1">
            <span class="font-medium text-lg text-trunks">Upload File{{ multiple ? "s" : "" }}</span>
            <span class="text-xs text-trunks">Or drag'n'drop here</span>
          </div>
        </div>
      </div>
    </Dropzone>
    <FileList class="flex flex-col gap-1">
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
  </Root>
</template>
