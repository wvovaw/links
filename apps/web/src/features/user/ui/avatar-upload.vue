<script setup lang="ts">
import { UIFileUpload } from "@links/ui";

const avatar = defineModel<File | null>();

defineOptions({ inheritAttrs: false });

const previewUrl = computed(() => {
  if (avatar.value)
    return URL.createObjectURL(avatar.value);
  return "";
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
            isOver ? 'border-piccolo' : avatar ? 'border-transparent' : 'border-beerus',
          ]"
        >
          <img
            v-if="avatar"
            data-allow-mismatch
            :src="previewUrl"
            class="h-full w-full object-cover"
            alt="avatar"
          >
          <span v-else class="i-lucide:camera h-10 w-10 text-trunks" />
        </div>
      </UIFileUpload.Dropzone>
      <UIFileUpload.Clear
        v-if="avatar"
        class="cursor-pointer text-sm text-trunks underline hover:text-chichi"
      >
        Remove avatar
      </UIFileUpload.Clear>
    </UIFileUpload.Root>
  </div>
</template>
