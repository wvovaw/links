<script setup lang="ts">
import { UIButton, UIInput } from "@links/ui";
import { qrSvg } from "~shared/blocks/qr";

import type { ShareChannel } from "../model";

import { shareChannels, taggedUrl } from "../model";

const props = defineProps<{
  /** The site's address; the slug is the page being shared. */
  base: string;
  slug: string;
}>();

const { t } = useI18n();

const source = ref("");
const medium = ref("");
const campaign = ref("");

const url = computed(() =>
  taggedUrl({
    base: props.base,
    slug: props.slug,
    source: source.value,
    medium: medium.value,
    campaign: campaign.value,
  }),
);

/**
 * The channel a set of tags belongs to, if any. Derived from the values rather than remembered, because the
 * fields are editable: once the owner types their own source, no preset is what they picked.
 */
const active = computed(
  () => shareChannels.find((channel) => channel.source === source.value && channel.medium === medium.value)?.id,
);

const qr = computed(() => qrSvg(url.value, { size: 168 }));

const copied = ref(false);
const manual = ref(false);
const box = ref<HTMLElement>();

/* A copy note describes the link that was copied; a different link needs a fresh one. */
watch(url, () => {
  copied.value = false;
  manual.value = false;
});

function pick(channel: ShareChannel) {
  source.value = channel.source;
  medium.value = channel.medium;
}

async function copy() {
  try {
    await navigator.clipboard.writeText(url.value);
    copied.value = true;
    manual.value = false;
  } catch {
    /* Blocked by permission or an insecure origin. Select the text so the owner can still take it. */
    manual.value = true;
    box.value?.querySelector("input")?.select();
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <UIButton
        v-for="channel of shareChannels"
        :key="channel.id"
        size="xs"
        variant="outline"
        :icon="channel.icon"
        :data-channel="channel.id"
        :data-active="active === channel.id ? 'true' : 'false'"
        @click="pick(channel)"
      >
        {{ t(`share.channels.${channel.id}`) }}
      </UIButton>
    </div>

    <div class="grid gap-3 sm:grid-cols-3">
      <label class="flex flex-col gap-1">
        <span class="text-moon-12 text-trunks">{{ t("share.fields.source") }}</span>
        <UIInput v-model="source" data-field="source" full-width :placeholder="t('share.fields.sourcePlaceholder')" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-moon-12 text-trunks">{{ t("share.fields.medium") }}</span>
        <UIInput v-model="medium" data-field="medium" full-width :placeholder="t('share.fields.mediumPlaceholder')" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-moon-12 text-trunks">{{ t("share.fields.campaign") }}</span>
        <UIInput
          v-model="campaign"
          data-field="campaign"
          full-width
          :placeholder="t('share.fields.campaignPlaceholder')"
        />
      </label>
    </div>

    <div ref="box" class="flex items-end gap-2">
      <label class="flex min-w-0 flex-1 flex-col gap-1">
        <span class="text-moon-12 text-trunks">{{ t("share.link") }}</span>
        <UIInput :model-value="url" data-url read-only full-width />
      </label>
      <UIButton
        size="sm"
        data-copy
        :data-copied="copied ? 'true' : 'false'"
        :icon="copied ? 'i-lucide:check' : 'i-lucide:copy'"
        @click="copy"
      >
        {{ copied ? t("share.copied") : t("share.copy") }}
      </UIButton>
    </div>

    <p v-if="manual" class="text-moon-12 text-chichi" data-testid="copy-hint">
      {{ t("share.copyManually") }}
    </p>

    <!-- The drawing is the qr library's own markup, with its colours and its capacity checked where it is built. -->
    <div v-if="qr" class="flex flex-col items-center gap-2">
      <span class="text-moon-12 text-trunks">{{ t("share.qr") }}</span>
      <div data-qr class="h-42 w-42" v-html="qr" />
    </div>
  </div>
</template>
