<script setup lang="ts">
import { NavigationBar } from "~components/NavigationBar";
import { NavigationMenu } from "~components/NavigationMenu";
import ThemeSwitcher from "~components/ThemeSwitcher.vue";
import LocaleSwitcher from "~components/LocaleSwitcher.vue";

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
      <NavigationBar>
        <template #left>
          <div class="flex items-center text-center text-2xl font-semibold font-averta">
            {{ t("site.sitename") }}
          </div>
        </template>
        <template #right>
          <div class="w-fit flex items-center gap-2">
            <ClientOnly>
              <LocaleSwitcher class="w-[150px]!" />
            </ClientOnly>
            <ThemeSwitcher icon-only />
          </div>
        </template>
      </NavigationBar>

      <div class="grid place-content-center">
        <slot />
      </div>
    </Body>
  </Html>
</template>
