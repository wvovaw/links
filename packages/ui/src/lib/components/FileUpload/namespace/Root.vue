<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { computed, provide, ref } from "vue";

import { FILE_UPLOAD_ROOT_KEY } from "./providers";

const props = withDefaults(
  defineProps<{
    modelValue?: File | File[] | null;
    multiple?: boolean;
    accept?: string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    multiple: false,
  },
);

const emits = defineEmits<{
  "update:modelValue": [payload: File | File[] | null];
  "change": [payload: File | File[] | null];
}>();

function update(val: File | File[] | null) {
  emits("update:modelValue", val);
  emits("change", val);
}

const files = computed<readonly File[]>(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue;
  if (props.modelValue instanceof File) return [props.modelValue];
  return [];
});

const inputRef = ref<HTMLInputElement>();

function openFilePicker() {
  inputRef.value?.click();
}

function mergeFiles(incoming: File[]) {
  const existing = files.value;
  if (!props.multiple || existing.length === 0) return incoming;

  const existingKeys = new Set(existing.map((f) => `${f.name}-${f.size}-${f.lastModified}`));
  const deduped = incoming.filter((f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`));
  return [...existing, ...deduped];
}

function addFiles(newFiles: File[]) {
  const merged = mergeFiles(newFiles);
  update(props.multiple ? merged : (merged[0] ?? null));
}

function removeFile(index: number) {
  if (!props.modelValue) return;
  if (props.multiple && Array.isArray(props.modelValue)) {
    const arr = [...props.modelValue];
    arr.splice(index, 1);
    update(arr.length > 0 ? arr : null);
  } else {
    update(null);
  }
}

function clearFiles() {
  update(null);
}

function handleInputChange(data: FileList | null) {
  if (data) addFiles(Array.from(data));
  if (inputRef.value) inputRef.value.value = "";
}

provide(FILE_UPLOAD_ROOT_KEY, {
  files,
  multiple: props.multiple,
  accept: props.accept,
  addFiles,
  removeFile,
  clearFiles,
  openFilePicker,
  inputRef,
});
</script>

<template>
  <div :class="props.class">
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :multiple="multiple"
      :accept="accept"
      @change="(e) => handleInputChange((e.target as HTMLInputElement).files)"
    />
    <slot />
  </div>
</template>
