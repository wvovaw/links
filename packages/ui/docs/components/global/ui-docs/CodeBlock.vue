<script setup lang="ts">
import { Slot } from "radix-vue";
import { UIButton } from "~ui/Button";

withDefaults(defineProps<{
  filename?: string;
  lang?: keyof (typeof icons);
}>(), {
  lang: "text",
});

const icons = {
  ts: "i-vscode-icons:file-type-typescript-official",
  js: "i-vscode-icons:file-type-js-official",
  vue: "i-vscode-icons:file-type-vue",
  html: "i-vscode-icons:file-type-html",
  css: "i-vscode-icons:file-type-css",
  text: "i-vscode-icons:file-type-text",
  shell: "i-lucide:terminal",
};

const slots = useSlots();
const code = slots.default ? slots.default()[0].props?.code as string : undefined;
const { copy, copied, isSupported } = useClipboard({ source: code });
</script>

<template>
  <section class="my-5">
    <div class="not-prose h-14 flex items-center gap-1.5 border border-b-0 border-beerus rounded-t-moon-s-xs bg-heles px-4 py-3">
      <span :class="icons[lang]" class="h-5 w-5" />
      <span class="grow text-moon-14 text-trunks">{{ filename }}</span>
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
    <Slot class="my-0 border border-beerus rounded-b-moon-s-xs rounded-t-none p-4">
      <ContentSlot :use="$slots.default" />
    </Slot>
  </section>
</template>
