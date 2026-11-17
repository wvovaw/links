<script setup lang="ts">
import { UIButton, UIDropdownMenu } from "@links/ui";
import { useLinksStore } from "~entities/links";
import { ShareLinkDialog } from "~widgets/link-share";

defineProps<{
  linkId: string;
  /** The page's address for sharing; the row already has it. */
  slug: string;
}>();
const { deleteLink } = useLinksStore();
</script>

<template>
  <div class="hidden flex-row gap-2 sm:flex">
    <NuxtLinkLocale :to="{ name: 'links-constructor-id', params: { id: linkId } }">
      <UIButton size="xs" icon="i-lucide:hammer" as="span"> Edit </UIButton>
    </NuxtLinkLocale>
    <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: linkId } }">
      <UIButton size="xs" icon="i-lucide:chart-no-axes-column" as="span"> Statistics </UIButton>
    </NuxtLinkLocale>
    <NuxtLinkLocale :to="{ name: 'links-preview-id', params: { id: linkId } }">
      <UIButton size="xs" icon="i-lucide:eye" as="span"> Preview </UIButton>
    </NuxtLinkLocale>
    <ShareLinkDialog :slug="slug" />
    <UIButton size="xs" icon="i-lucide:trash" color="chichi" variant="outline" @click="deleteLink(linkId)">
      Delete
    </UIButton>
  </div>
  <div class="flex items-center gap-1 sm:hidden">
    <ShareLinkDialog :slug="slug" compact />
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger class="grid h-6 w-6 place-content-center rounded-full hover:bg-heles">
        <span class="i-lucide:ellipsis m-auto inline-block" />
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content align="center">
        <NuxtLinkLocale :to="{ name: 'links-constructor-id', params: { id: linkId } }">
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Edit</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemIcon icon="i-lucide:hammer" />
          </UIDropdownMenu.Item>
        </NuxtLinkLocale>
        <NuxtLinkLocale :to="{ name: 'links-id-stats', params: { id: linkId } }">
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Statistics</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemIcon icon="i-lucide:chart-no-axes-column" />
          </UIDropdownMenu.Item>
        </NuxtLinkLocale>
        <NuxtLinkLocale :to="{ name: 'links-preview-id', params: { id: linkId } }">
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Open preview</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemIcon icon="i-lucide:eye" />
          </UIDropdownMenu.Item>
        </NuxtLinkLocale>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Item class="color-chichi" @click="deleteLink(linkId)">
          <UIDropdownMenu.ItemTitle>Delete</UIDropdownMenu.ItemTitle>
          <UIDropdownMenu.ItemIcon icon="i-lucide:trash" />
        </UIDropdownMenu.Item>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </div>
</template>
