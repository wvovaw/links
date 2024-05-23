<script setup lang="ts">
import PageNotFound from "./private/page-not-found.vue";
import OverlayHud from "./private/overlay-hud.vue";
import { LinksApi } from "~shared/api/appwrite";
import { LinkPageRenderer } from "~features/links";
import type { IBlock } from "~shared/core";

const props = defineProps<{
  linkId: string;
}>();

const blocks = ref<IBlock[]>();
const background = ref<string>();

const { data, error } = await useAsyncData("preview-link-data", () => LinksApi.getLink(props.linkId));

if (data?.value?.blocks)
  blocks.value = JSON.parse(data.value.blocks);
if (data.value?.background)
  background.value = data.value.background;
</script>

<template>
  <template v-if="error">
    <PageNotFound />
  </template>
  <template v-else-if="blocks">
    <div class="relative min-h-100vh flex flex-col">
      <LinkPageRenderer
        :blocks="blocks"
        :background-css="background"
      />
      <OverlayHud :link-id="linkId" />
    </div>
  </template>
</template>
