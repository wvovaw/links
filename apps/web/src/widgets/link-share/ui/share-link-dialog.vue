<script setup lang="ts">
import { UIButton, UIDialog } from "@links/ui";

import ShareLinkForm from "./share-link-form.vue";

const props = withDefaults(
  defineProps<{
    /** The page being shared; the address is built from it. */
    slug: string;
    /** The mobile bar has no room for a word, so the trigger becomes the icon alone. */
    compact?: boolean;
  }>(),
  { compact: false },
);

const open = ref(false);
const config = useRuntimeConfig();
const { t } = useI18n();

/* The published page lives on the public site, which is not always the origin the constructor runs on. */
const base = computed(() => config.public.baseUrl || useRequestURL().origin);
</script>

<template>
  <UIDialog.Root v-model:open="open">
    <UIDialog.Trigger as-child>
      <UIButton
        size="xs"
        icon="i-lucide:share"
        variant="outline"
        :aria-label="compact ? t('share.title') : undefined"
        @click="open = true"
      >
        <span v-if="!compact">{{ t("share.title") }}</span>
      </UIButton>
    </UIDialog.Trigger>
    <UIDialog.Content class="sm:max-w-lg">
      <UIDialog.Header>
        <UIDialog.Title>{{ t("share.title") }}</UIDialog.Title>
        <UIDialog.Subtitle>{{ t("share.subtitle") }}</UIDialog.Subtitle>
      </UIDialog.Header>
      <ShareLinkForm :base="base" :slug="props.slug" />
      <UIDialog.Footer class="justify-end">
        <UIDialog.Close as-child>
          <UIButton size="sm" variant="outline">{{ t("share.close") }}</UIButton>
        </UIDialog.Close>
      </UIDialog.Footer>
    </UIDialog.Content>
  </UIDialog.Root>
</template>
