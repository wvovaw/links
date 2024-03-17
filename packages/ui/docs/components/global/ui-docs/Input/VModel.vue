<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIInput } from "~ui/Input";
import { UIButton } from "~ui/Button";

const inp1 = ref();
const inp2 = ref();
const error2 = ref<boolean>(false);

watch([inp2], () => {
  if (inp2.value === "Hello World!")
    error2.value = false;
  else error2.value = true;
});
</script>

<template>
  <PreviewFrame>
    <div class="flex flex-rows flex-wrap justify-around gap-4">
      <div
        class="border-(1 beerus) rounded-moon-s-sm max-w-xs p-4 flex flex-col gap-2"
      >
        <div class="space-y-2">
          <label class="text-trunks" for="inp-1">Input something</label>
          <div class="w-full flex gap-2">
            <UIInput id="inp-1" v-model="inp1" size="sm" full-width />
            <UIButton icon="i-lucide:iteration-cw" size="sm" aria-label="reset" @click="inp1 = ''" />
          </div>
          <div class="h-3">
            &rightarrow; {{ inp1 }}
          </div>
        </div>
      </div>
      <div
        class="border-(1 beerus) rounded-moon-s-sm max-w-xs p-4 flex flex-col gap-2"
      >
        <div class="space-y-2">
          <label class="text-trunks" for="inp-2">Input 'Hello World!'</label>
          <div class="w-full flex gap-2">
            <UIInput id="inp-2" v-model="inp2" size="sm" :error="error2" error-message="Hello World! expected" full-width />
            <UIButton icon="i-lucide:iteration-cw" size="sm" aria-label="reset" @click="inp2 = ''" />
          </div>
          <div class="h-5 flex">
            <span v-if="error2 === true" class="i-lucide:x" aria-hidden />
            <span v-else class="i-lucide:check" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  </PreviewFrame>
</template>
