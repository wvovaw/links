<script setup lang="ts">
import type { IBlock } from "~shared/core";
import type { ILinkPageDocument } from "~shared/api/appwrite";
import { LinkPageRenderer } from "~features/links";
import { LinkFooter } from "~widgets/link-footer";

const props = defineProps<{
  link: string;
}>();

const { locale } = useI18n();
const config = useRuntimeConfig();

const { data: pageData } = await useFetch<ILinkPageDocument>(`/api/${props.link}`);

const blocks = ref<IBlock[]>([]);
const seo = ref<Record<string, any>>({});
const bg = ref<string>();

const defaultDescription = "Welcome to my link";

if (pageData.value) {
  blocks.value = JSON.parse(pageData.value.blocks);
  seo.value = JSON.parse(pageData.value.seo);
  bg.value = pageData.value.background;

  // console.log(pageData.value.$nitroCachedAt)

  const title = pageData.value.title;
  const description = seo.value.description ? seo.value.description : defaultDescription;
  const url = `${config.public.baseUrl}/${props.link}`;

  // TODO: get the seo data from backend
  // TODO: need more work on seo
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: "website",
  });
  useHead({
    link: [
      { rel: "canonical", href: url },
    ],
  });
}
else {
  throw createError("Requested link not found");
}
</script>

<template>
  <Html :lang="locale">
    <Body>
      <main class="min-h-100dvh flex flex-col" :style="bg">
        <LinkPageRenderer :blocks="blocks" />
        <LinkFooter />
      </main>
    </Body>
  </Html>
</template>
