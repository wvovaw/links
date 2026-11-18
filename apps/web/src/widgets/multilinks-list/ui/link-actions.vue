<script setup lang="ts">
import { UIButton, UIDropdownMenu } from "@links/ui";
import { useLinksStore } from "~entities/links";
import { ShareLinkDialog } from "~widgets/link-share";

const props = defineProps<{
  linkId: string;
  /** The page's address for sharing; the row already has it. */
  slug: string;
}>();

/** Raised only once the page is really gone, so the screen above it can recount without a wasted read. */
const emit = defineEmits<{ deleted: [] }>();

const { t } = useI18n();
const { deleteLink } = useLinksStore();

async function remove() {
  if (await deleteLink(props.linkId)) emit("deleted");
}
</script>

<template>
  <div class="flex flex-row items-center justify-end gap-1">
    <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: linkId } }">
      <UIButton
        size="xs"
        variant="outline"
        icon-only
        icon="i-lucide:chart-no-axes-column"
        :aria-label="t('stats.title')"
        as="span"
      />
    </NuxtLinkLocale>
    <NuxtLinkLocale :to="{ name: 'links-constructor-id', params: { id: linkId } }">
      <UIButton size="xs" variant="outline" as="span">{{ t("links.edit") }}</UIButton>
    </NuxtLinkLocale>

    <ShareLinkDialog :slug="slug" compact />

    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger
        :aria-label="t('links.more')"
        class="grid h-6 w-6 place-content-center rounded-moon-i-xs text-trunks hover:bg-heles"
      >
        <span class="i-lucide:ellipsis m-auto inline-block" />
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content align="end">
        <NuxtLinkLocale :to="{ name: 'links-preview-id', params: { id: linkId } }">
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>{{ t("links.preview") }}</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemIcon icon="i-lucide:eye" />
          </UIDropdownMenu.Item>
        </NuxtLinkLocale>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Item class="color-chichi" @click="remove">
          <UIDropdownMenu.ItemTitle>{{ t("links.delete") }}</UIDropdownMenu.ItemTitle>
          <UIDropdownMenu.ItemIcon icon="i-lucide:trash" />
        </UIDropdownMenu.Item>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </div>
</template>
