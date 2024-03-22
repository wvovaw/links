<script setup lang="ts">
import { UIScrollArea } from "~ui/ScrollArea";

const props = withDefaults(defineProps<{ value: any }>(), {});
const tocLinks = computed(() => props.value?.body?.toc?.links ?? []);
const visible = ref(false);

watch(() => props.value, async () => {
  visible.value = false;
  await nextTick();
  visible.value = true;
});
</script>

<template>
  <aside class="sticky top-0 h-100vh border-(l-1 beerus) bg-gohan transition-transform -translate-x-full sm:translate-x-0">
    <UIScrollArea as-child>
      <div class="px-4 pt-4 text-bulma font-semibold">
        Table of Contents
      </div>
      <Transition
        appear
        mode="out-in"
        type="transition"
        enter-active-class="transition duration-250"
        leave-active-class="transition duration-250"

        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <nav v-if="visible" class="flex gap-2 px-4 py-6 text-trunks">
          <ul class="toc-h2 space-y-2" data-toc-h2>
            <li
              v-for="{ id, text, children } in tocLinks"
              :id="`toc-${id}`"
              :key="id"
            >
              <NuxtLink
                :to="`#${id}`"
                class="cursor-pointer list-none last:mb-0"
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
                  >
                    {{ chText }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </Transition>
    </UIScrollArea>
  </aside>
</template>
