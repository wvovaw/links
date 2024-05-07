<script setup lang="ts">
import { UIButton, UIDropdownMenu } from "@links/ui";
import { useLinksStore } from "~entities/links";

defineProps<{
  linkId: string;
}>();
const { deleteLink } = useLinksStore();
</script>

<template>
  <div class="hidden flex-row gap-2 sm:flex">
    <NuxtLinkLocale :to="`/links/constructor/${linkId}`">
      <UIButton size="xs" icon="i-lucide:hammer" as="span">
        Edit
      </UIButton>
    </NuxtLinkLocale>
    <UIButton size="xs" icon="i-lucide:eye">
      Preview
    </UIButton>
    <UIButton size="xs" icon="i-lucide:trash" color="chichi" variant="outline" @click="deleteLink(linkId)">
      Delete
    </UIButton>
  </div>
  <div class="sm:hidden">
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger class="grid h-6 w-6 place-content-center rounded-full hover:bg-heles">
        <span class="i-lucide:ellipsis m-auto inline-block" />
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content align="center">
        <NuxtLinkLocale :to="`/links/constructor/${linkId}`">
          <UIDropdownMenu.Item>
            <UIDropdownMenu.ItemTitle>Edit</UIDropdownMenu.ItemTitle>
            <UIDropdownMenu.ItemIcon icon="i-lucide:hammer" />
          </UIDropdownMenu.Item>
        </NuxtLinkLocale>
        <UIDropdownMenu.Item>
          <UIDropdownMenu.ItemTitle>Open preview</UIDropdownMenu.ItemTitle>
          <UIDropdownMenu.ItemIcon icon="i-lucide:eye" />
        </UIDropdownMenu.Item>
        <UIDropdownMenu.Separator />
        <UIDropdownMenu.Item class="color-chichi" @click="deleteLink(linkId)">
          <UIDropdownMenu.ItemTitle>Delete</UIDropdownMenu.ItemTitle>
          <UIDropdownMenu.ItemIcon icon="i-lucide:trash" />
        </UIDropdownMenu.Item>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </div>
</template>
