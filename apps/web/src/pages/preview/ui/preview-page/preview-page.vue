<script setup lang="ts">
import type { IBlock } from "@links/blocks";
import PageNotFound from "./private/page-not-found.vue";
import OverlayHud from "./private/overlay-hud.vue";
import { LinksApi } from "~shared/api/appwrite";
import { LinkPageRenderer } from "~features/links";

const props = defineProps<{
  linkId: string;
}>();

const blocks = ref<IBlock[]>();
const background = ref<string>();
const linkName = ref<string>("");

const { data, error } = await useAsyncData("preview-link-data", () => LinksApi.getLink(props.linkId));

if (data?.value) {
  blocks.value = JSON.parse(data.value.blocks);
  background.value = data.value.background;
  linkName.value = data.value.name.$id;

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
      <LinkPageRenderer
        :blocks="blocks"
        :background-css="background"
      />
      <OverlayHud :link-id="linkId" :link-name="linkName" />
    </div>
  </template>
</template>
