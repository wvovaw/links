<script setup lang="ts">
import type { IBlock } from "@links/blocks";
import type { PublicLink } from "~shared/api/backend";
import { LinkPageRenderer } from "~features/links";
import { LinkFooter } from "~widgets/link-footer";

const props = defineProps<{
  link: string;
}>();

const { locale } = useI18n();
const config = useRuntimeConfig();

const { data: pageData } = await useFetch<PublicLink>(`/api/${props.link}`);

const blocks = ref<IBlock[]>([]);
const seo = ref<Record<string, any>>({});
const bg = ref<string>();

const defaultDescription = "Welcome to my link";

if (pageData.value) {
  blocks.value = pageData.value.blocks as IBlock[];
  seo.value = pageData.value.seo;
  bg.value = pageData.value.background;

  const title = pageData.value.title;
  const description = seo.value.description ? seo.value.description : defaultDescription;
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
