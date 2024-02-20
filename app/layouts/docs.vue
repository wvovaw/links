<script setup lang="ts">
import { NavigationBar } from "~components/NavigationBar";
import ThemeSwitcher from "~components/ThemeSwitcher.vue";
import { DocsAsideNavigation } from "~components/DocsAsideNavigation";

const { t } = useI18n();
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Head>
      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
    </Head>
    <Body>
      <NavigationBar>
        <template #left>
          <span class="font-averta font-semibold text-2xl text-center flex items-center">
            {{ t("site.sitename") }}
          </span>
        </template>
        <template #right>
          <ThemeSwitcher />
        </template>
      </NavigationBar>
      <div class="grid grid-cols-[minmax(250px,250px)_minmax(320px,1fr)_minmax(250px,250px)] gap-8">
        <DocsAsideNavigation />
        <main class="p-4 md:p-0 max-w-screen-lg">
          <slot />
        </main>
        <aside class="hidden lg:block sticky top-0 h-100vh p-6 border-(l-1 beerus) bg-gohan">
          <div class="w-full text-center">
            Table of contents
          </div>
        </aside>
      </div>
    </Body>
  </Html>
</template>

<style scoped>
</style>
