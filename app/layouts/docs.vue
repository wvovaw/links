<script setup lang="ts">
import { NavigationBar } from "~components/NavigationBar";
import ThemeSwitcher from "~components/ThemeSwitcher.vue";
import { DocsAsideNavigation } from "~components/DocsAsideNavigation";

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
</script>

<template>
  <div>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
      <Head>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body class="bg-background font-sans">
        <NavigationBar>
          <template #right>
            <ThemeSwitcher />
          </template>
        </NavigationBar>
        <div class="docs-grid">
          <aside class="docs-grid__aside">
            <DocsAsideNavigation />
          </aside>
          <main class="docs-grid__content">
            <slot />
          </main>
          <section class="docs-grid__toc">
            <div class="w-full text-center">
              Table of contents
            </div>
          </section>
        </div>
      </Body>
    </Html>
  </div>
</template>

<style scoped>
.docs-grid {
  display: grid;
  grid-template-columns: minmax(250px, 250px) minmax(320px, 1fr) minmax(250px, 250px);
  gap: 2em;
}
.docs-grid__aside {
  position: sticky;
  top:0;
  height: 100vh;
  padding: 1.5rem;
  border-right: 1px hsl(var(--border)) solid;
}
.docs-grid__content {
}
.docs-grid__toc {
  position: sticky;
  top:0;
  height: 100vh;
  padding: 1.5rem;
  border-left: 1px hsl(var(--border)) solid;
}
</style>
