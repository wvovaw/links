<script setup lang="ts">
import { UIFileUpload } from "@links/ui";

const props = defineProps<{
  /** absolute avatar url. Need for SSR */
  src?: string;
}>();
const avatar = defineModel<File | null>();

defineOptions({ inheritAttrs: false });

const previewUrl = ref("");

function cleanup() {
  if (previewUrl.value)
    URL.revokeObjectURL(previewUrl.value);
}

function setPreview(file: File | null | undefined) {
  cleanup();
  previewUrl.value = file instanceof File ? URL.createObjectURL(file) : "";
}

if (import.meta.client) {
  watch(avatar, setPreview);
  onBeforeUnmount(() => {
    cleanup();
  });
}

// SSR friendly avatar src property
const avatarSrc = computed(() => {
  if (previewUrl.value)
    return previewUrl.value;
  if (avatar.value === null)
    return "";
  return props.src ?? "";
});
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <UIFileUpload.Root
      v-model="avatar"
      accept="image/*"
    >
      <UIFileUpload.Dropzone v-slot="{ isOver }">
        <div
          class="grid h-36 w-36 cursor-pointer place-content-center overflow-hidden border-2 rounded-full border-dashed md:h-48 md:w-48"
          :class="[
            isOver ? 'border-piccolo' : avatarSrc ? 'border-transparent' : 'border-beerus',
          ]"
        >
          <img
            v-if="avatarSrc"
            :src="avatarSrc"
            class="h-full w-full object-cover"
            alt="avatar"
          >
          <span v-else class="i-lucide:camera h-10 w-10 text-trunks" />
        </div>
      </UIFileUpload.Dropzone>
      <UIFileUpload.Clear
        v-if="avatarSrc"
        class="cursor-pointer text-sm text-trunks underline hover:text-chichi"
      >
        Remove avatar
      </UIFileUpload.Clear>
    </UIFileUpload.Root>
  </div>
</template>
