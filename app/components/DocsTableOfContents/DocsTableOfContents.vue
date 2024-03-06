<script setup lang="ts">
import { UIScrollArea } from "~ui/ScrollArea";

const props = withDefaults(defineProps<{ activeTocId: string | null; value: any }>(), {});
const tocLinks = computed(() => props.value?.body?.toc?.links ?? []);
</script>

<template>
  <aside class="sticky h-100vh top-0 border-(l-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <UIScrollArea as-child>
      <nav class="py-6 px-4 text-trunks flex gap-2">
        <ul class="toc-h2 space-y-2" data-toc-h2>
          <li
            v-for="{ id, text, children } in tocLinks"
            :id="`toc-${id}`"
            :key="id"
          >
            <NuxtLink
              :to="`#${id}`"
              class="cursor-pointer list-none last:mb-0"
              :class="{ 'font-semibold text-bulma': id === activeTocId }"
            >
              {{ text }}
            </NuxtLink>
            <ul v-if="children" class="my-2 ml-3 space-y-2" data-toc-h3>
              <li
                v-for="{ id: chId, text: chText } in children"
                :id="`toc-${chId}`"
                :key="chId"
              >
                <NuxtLink
                  :to="`#${chId}`"
                  class="cursor-pointer list-none last:mb-0"
                  :class="{ 'font-semibold text-bulma': chId === activeTocId }"
                >
                  {{ chText }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </UIScrollArea>
  </aside>
</template>
