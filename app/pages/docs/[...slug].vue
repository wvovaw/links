<script setup lang="ts">
import { DocsAsideNavigation } from "~components/DocsAsideNavigation";
import { DocsTableOfContents } from "~components/DocsTableOfContents";

const activeTocId = ref<string | null>(null);
const contentRenderer = ref(null);

const observer: Ref<IntersectionObserver | null | undefined> = ref(null);
const observerOptions = reactive<IntersectionObserverInit>({
  root: contentRenderer.value,
  threshold: 0.5,
});

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.isIntersecting)
        activeTocId.value = id;
    });
  }, observerOptions);

  document.querySelectorAll(".nuxt-content h2[id], .nuxt-content h3[id]").forEach((section) => {
    observer.value?.observe(section);
  });
});

onUnmounted(() => {
  observer.value?.disconnect();
});

definePageMeta({ layout: "docs" });
</script>

<template>
  <ContentDoc>
    <template #default="{ doc }">
      <div class="md:grid md:grid-cols-[minmax(250px,250px)_minmax(320px,1fr)] lg:grid-cols-[minmax(250px,250px)_minmax(320px,1fr)_minmax(250px,250px)] gap-8">
        <DocsAsideNavigation class="hidden md:block " />
        <main class="p-4 lg:p-0 max-w-screen-lg">
          <ContentRenderer v-if="doc" ref="contentRenderer" :value="doc" class="nuxt-content prose w-full max-w-full" />
        </main>
        <DocsTableOfContents :value="doc" :active-toc-id="activeTocId" class="hidden lg:block" />
      </div>
    </template>
  </ContentDoc>
</template>
