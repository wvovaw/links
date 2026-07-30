<script setup lang="ts">
import { UISwitch } from "@links/ui";
import { LinkStatus } from "~shared/api/backend";

import { useConstructorStore } from "../../model";

const constructorStore = useConstructorStore();
const { linkName, publishStatus } = storeToRefs(constructorStore);
const { setPublishStatus } = constructorStore;

const baseUrl = useRuntimeConfig().public.baseUrl || useRequestURL().origin;
const url = computed(() => {
  if (linkName.value) {
    const linkUrl = new URL(linkName.value, baseUrl);
    return linkUrl;
  } else {
    return null;
  }
});

const [publishStatusToggle, togglePublishStatus] = useToggle(publishStatus.value, {
  falsyValue: LinkStatus.DRAFT,
  truthyValue: LinkStatus.PUBLISHED,
});
watch(publishStatusToggle, (newStatus) => {
  setPublishStatus(newStatus);
});
const published = computed(() => publishStatusToggle.value === LinkStatus.PUBLISHED);
</script>

<template>
  <div v-if="url" class="bg-heles px-2 py-2 sm:(mb-3 mt-1 rounded-moon-s-sm)">
    <div class="flex items-center gap-4">
      <div class="relative flex grow-1 items-center border-1 border-beerus rounded-moon-s-sm bg-goku px-2 py-1">
        <div class="text-sm">
          <span class="text-trunks" v-text="`${url.origin}/`" />
          <span>{{ linkName }}</span>
        </div>
        <NuxtLink :to="url.pathname" target="_blank" class="absolute right-2">
          <div class="i-lucide:external-link h-6 text-bulma" />
        </NuxtLink>
      </div>
      <div class="flex flex-row gap-2">
        <label for="publish-link-switch" class="text-xs">Publish</label>
        <UISwitch id="publish-link-switch" :checked="published" size="xs" @update:checked="togglePublishStatus()" />
      </div>
    </div>
  </div>
</template>
