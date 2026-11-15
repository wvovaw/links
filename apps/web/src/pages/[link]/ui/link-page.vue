<script setup lang="ts">
import type { IBlock } from "@links/blocks";
import type { PublicLink } from "~shared/api/backend";

import { LinkPageRenderer } from "~features/links";
import { BackendApi } from "~shared/api";
import { resolvePageStyle, visibleBlocks } from "~shared/blocks";
import { LinkFooter } from "~widgets/link-footer";

import NotExistPage from "./not-exist-page.vue";

const props = defineProps<{
  link: string;
}>();

const { locale } = useI18n();
const config = useRuntimeConfig();

/**
 * One clock decides the whole request: a block its schedule hides is dropped from the payload with the
 * same instant the renderer filters the markup with. The whole answer becomes part of the served HTML,
 * so filtering at render time alone would still ship a hidden block's text to every visitor.
 */
const now = new Date();
const { data: pageData, error } = await useAsyncData<PublicLink | null>(`link:${props.link}`, async () => {
  const link = await BackendApi.PublicApi.getPublicLink(props.link);
  if (!link) return link;

  return { ...link, blocks: visibleBlocks(link.blocks as IBlock[], now) };
});

const blocks = ref<IBlock[]>([]);
const seo = ref<Record<string, unknown>>({});

/* The page background belongs to `<main>` so it covers the footer, exactly as a legacy page expects. */
const pageStyle = computed(() => resolvePageStyle(pageData.value?.theme ?? null, pageData.value?.background ?? null));

const defaultDescription = "Welcome to my link";

if (pageData.value) {
  blocks.value = pageData.value.blocks as IBlock[];
  seo.value = pageData.value.seo;

  const title = pageData.value.title;
  const description = typeof seo.value.description === "string" ? seo.value.description : defaultDescription;
  const url = `${config.public.baseUrl}/${props.link}`;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: "website",
  });
  useHead({
    link: [{ rel: "canonical", href: url }],
  });
}
</script>

<template>
  <Html :lang="locale">
    <Body>
      <main class="min-h-100dvh flex flex-col" :style="pageStyle">
        <NotExistPage v-if="error?.status === 404" />
        <LinkPageRenderer v-else :blocks="blocks" :now="now" />
        <LinkFooter />
      </main>
    </Body>
  </Html>
</template>
