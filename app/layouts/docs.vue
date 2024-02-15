<script setup lang="ts">
import { SideNavigationBar } from "~components/SideNavigationBar";

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
      <Body class="bg-bg font-sans">
        <SideNavigationBar />
        <div class="p-4 sm:ml-64 grid place-content-center m-4">
          <div class="container">
            <slot />
          </div>
        </div>
      </Body>
    </Html>
  </div>
</template>
