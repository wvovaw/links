<script setup lang="ts">
import { TopNavbar } from "~widgets/top-navbar";
import { ToggleTheme } from "~features/ui-theme";
import { ChangeLanguage } from "~features/localization";

const route = useRoute();
const { t } = useI18n();
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const title = computed(() => t(route.meta.title as string));
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <Title>{{ title }}</Title>
      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <TopNavbar>
        <template #left>
          <div class="flex items-center text-center text-2xl font-semibold font-averta">
            {{ t("site.sitename") }}
          </div>
        </template>
        <template #right>
          <div class="w-fit flex items-center gap-2">
            <ClientOnly>
              <ChangeLanguage class="w-[150px]!" />
            </ClientOnly>
            <ToggleTheme icon-only />
          </div>
        </template>
      </TopNavbar>

      <div class="grid min-h-[calc(100vh-var(--navbar-height))] place-content-center">
        <slot />
      </div>
    </Body>
  </Html>
</template>
