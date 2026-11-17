<script setup lang="ts">
import type { IBlock, PageTheme } from "@links/blocks";

import { LinkPageRenderer } from "~features/links";
import { LinksApi } from "~shared/api/backend";

import OverlayHud from "./private/overlay-hud.vue";
import PageNotFound from "./private/page-not-found.vue";

const props = defineProps<{
  linkId: string;
}>();

/* The preview is a page of its own request, so its markup is filtered with one clock as well. */
const now = new Date();
const blocks = ref<IBlock[]>();
const theme = ref<PageTheme | null>(null);
const background = ref<string>();
const linkName = ref<string>("");

const { data, error } = await useAsyncData("preview-link-data", () => LinksApi.getLink(props.linkId));

if (data?.value) {
  blocks.value = data.value.blocks as IBlock[];
  theme.value = data.value.theme;
  background.value = data.value.background;
  linkName.value = data.value.slug;

  const title = data.value.title;
  if (title) {
    useSeoMeta({
      title: () => `${title} | Preview`,
    });
  }
}
</script>

<template>
  <template v-if="error">
    <PageNotFound />
  </template>
  <template v-else-if="blocks">
    <div class="relative min-h-100vh flex flex-col">
      <LinkPageRenderer :blocks="blocks" :theme="theme" :background="background" :now="now" />
      <OverlayHud :link-id="linkId" :link-name="linkName" />
    </div>
  </template>
</template>
