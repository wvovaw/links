<script setup lang="ts">
import { Slot } from "radix-vue";
import { UIButton } from "~ui/Button";

const icons = {
  ts: "i-vscode-icons:file-type-typescript-official",
  js: "i-vscode-icons:file-type-js-official",
  vue: "i-vscode-icons:file-type-vue",
  html: "i-vscode-icons:file-type-html",
  css: "i-vscode-icons:file-type-css",
  text: "i-vscode-icons:file-type-text",
  shell: "i-lucide:terminal",
};

withDefaults(defineProps<{
  filename?: string;
  lang?: keyof (typeof icons);
}>(), {
  lang: "text",
});
const slots = useSlots();
const code = slots.default ? slots.default()[0].props?.code as string : undefined;
const { copy, copied, isSupported } = useClipboard({ source: code });
</script>

<template>
  <section class="my-5">
    <div class="flex items-center gap-1.5 border border-beerus bg-heles border-b-0 rounded-t-moon-s-xs px-4 py-3 h-14 not-prose">
      <span :class="icons[lang]" class="w-5 h-5" />
      <span class="text-trunks text-moon-14 grow">{{ filename }}</span>
      <ClientOnly>
        <UIButton
          v-if="code && isSupported"
          size="sm"
          variant="ghost"
          :icon="copied ? 'i-lucide:copy-check' : 'i-lucide:copy'"
          class="focus:ring-0!"
          @click="copy()"
        />
      </ClientOnly>
    </div>
    <Slot class="border border-beerus rounded-b-moon-s-xs my-0 p-4 rounded-t-none">
      <ContentSlot :use="$slots.default" />
    </Slot>
  </section>
</template>
