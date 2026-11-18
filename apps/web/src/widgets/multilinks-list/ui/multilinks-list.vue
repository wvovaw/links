<script setup lang="ts">
import { UIButton, UICard, UIPagination, UISelect, UITable, UITag, useToast } from "@links/ui";
import { useClipboard } from "@vueuse/core";
import { CreateNewLinkDialog, useLinksStore } from "~entities/links";
import { CreateNewLinkForm } from "~features/links";
import { LinkStatus } from "~shared/api/backend";
import { LoadingSpinner } from "~shared/ui/loading-spinner";

import type { LinksListRow } from "../model";

import EmptyState from "./empty-state.vue";
import LinkActions from "./link-actions.vue";

const props = defineProps<{ links: LinksListRow[]; loading?: boolean }>();
const emit = defineEmits<{ deleted: [] }>();

const { t, locale } = useI18n();
const config = useRuntimeConfig();
const { deleteLink } = useLinksStore();
const { copy } = useClipboard();
const { toast } = useToast();

const PAGE_SIZES = [10, 25, 50];

const perPage = ref(PAGE_SIZES[0]);
const page = ref(1);

const pageCount = computed(() => Math.max(1, Math.ceil(props.links.length / perPage.value)));
const visible = computed(() => props.links.slice((page.value - 1) * perPage.value, page.value * perPage.value));

/* A deletion can take the last page away under the reader; they land on the list, not on nothing. */
watch([() => props.links.length, perPage], () => {
  page.value = Math.min(page.value, pageCount.value);
});

const address = (slug: string) => `${config.public.baseUrl}/${slug}`;

async function copyAddress(slug: string) {
  const url = address(slug);
  await copy(url);
  toast({ title: t("links.copy.done"), content: url, variant: "success" });
}

/** The API writes ISO strings; a reader gets the date in their own locale, and a dash if it cannot parse. */
function formatUpdatedAt(value: string): string {
  const at = new Date(value);

  return Number.isNaN(at.getTime()) ? "—" : new Intl.DateTimeFormat(locale.value, { dateStyle: "medium" }).format(at);
}

async function remove(id: string) {
  if (await deleteLink(id)) emit("deleted");
}
</script>

<template>
  <UICard.Root class="min-w-0 rounded-moon-s-md bg-gohan shadow-moon-sm">
    <UICard.Header class="flex-row flex-wrap justify-between gap-3">
      <UICard.Title class="flex justify-between">
        <div class="flex items-center gap-2 text-moon-16 font-semibold">
          <span class="i-lucide:list size-5 text-piccolo" aria-hidden="true" />
          {{ t("links.card.title") }}
        </div>

        <CreateNewLinkDialog class="w-fit">
          <!-- TODO: Make the form KeepAlive within dialog between it's open/close states -->
          <CreateNewLinkForm />
        </CreateNewLinkDialog>
      </UICard.Title>
    </UICard.Header>

    <UICard.Body class="p-0">
      <UITable.Root>
        <UITable.Header>
          <UITable.Head>{{ t("links.columns.title") }}</UITable.Head>
          <UITable.Head>{{ t("links.columns.link") }}</UITable.Head>
          <UITable.Head>{{ t("stats.totals.clicks") }}</UITable.Head>
          <UITable.Head>{{ t("stats.totals.visitors") }}</UITable.Head>
          <UITable.Head>{{ t("links.columns.updated") }}</UITable.Head>
          <!--
            The actions pin to the card's right edge: on a narrow window the table scrolls inside its card,
            and the one column a reader came for must not be the one that scrolls away.
          -->
          <UITable.Head class="sticky right-0 w-0 bg-gohan">{{ t("links.columns.actions") }}</UITable.Head>
        </UITable.Header>

        <UITable.Body>
          <UITable.Row v-if="!links.length" class="hover:bg-transparent">
            <UITable.Cell colspan="100%">
              <div v-if="loading" class="flex w-full flex-col place-items-center gap-3">
                <LoadingSpinner class="h-16 w-16 text-trunks" />
                <div class="text-lg font-semibold">{{ t("links.loading") }}</div>
              </div>
              <EmptyState v-else>
                <div class="mt-6">
                  <CreateNewLinkDialog>
                    <CreateNewLinkForm />
                  </CreateNewLinkDialog>
                </div>
              </EmptyState>
            </UITable.Cell>
          </UITable.Row>

          <UITable.Row
            v-for="row of visible"
            v-else
            :key="row.id"
            class="group"
            :data-link-slug="row.slug"
            :data-clicks="row.clicks"
            :data-visitors="row.visitors"
          >
            <UITable.Cell class="min-w-0">
              <div class="flex items-center gap-3">
                <!-- No page preview image exists to show, so the page gets its own initial. -->
                <span
                  class="grid size-10 shrink-0 place-content-center rounded-moon-s-xs bg-heles text-moon-16 font-semibold uppercase"
                  aria-hidden="true"
                >
                  {{ row.title.slice(0, 1) }}
                </span>
                <div class="flex min-w-0 flex-col gap-1">
                  <span class="truncate font-semibold">{{ row.title }}</span>
                  <span class="flex items-center gap-2">
                    <span class="truncate text-moon-12 text-trunks">/{{ row.slug }}</span>
                    <UITag size="xs" :variant="row.status === LinkStatus.DRAFT ? 'outline' : 'fill'">
                      {{ row.status }}
                    </UITag>
                  </span>
                </div>
              </div>
            </UITable.Cell>

            <UITable.Cell>
              <div class="flex items-center gap-2">
                <a
                  :href="address(row.slug)"
                  target="_blank"
                  rel="noreferrer"
                  class="max-w-56 truncate text-piccolo hover:underline"
                >
                  {{ address(row.slug) }}
                </a>
                <UIButton
                  size="xs"
                  variant="ghost"
                  icon-only
                  icon="i-lucide:copy"
                  :aria-label="t('links.copy')"
                  @click="copyAddress(row.slug)"
                />
              </div>
            </UITable.Cell>

            <UITable.Cell>{{ row.clicks }}</UITable.Cell>
            <UITable.Cell>{{ row.visitors }}</UITable.Cell>
            <UITable.Cell class="whitespace-nowrap text-trunks">{{ formatUpdatedAt(row.updatedAt) }}</UITable.Cell>
            <UITable.Cell class="sticky right-0 bg-gohan group-hover:bg-heles">
              <LinkActions :link-id="row.id" :slug="row.slug" @deleted="remove" />
            </UITable.Cell>
          </UITable.Row>
        </UITable.Body>
      </UITable.Root>
    </UICard.Body>

    <UICard.Footer v-if="links.length" class="flex flex-wrap items-center justify-between gap-3 border-t border-beerus">
      <div class="flex items-center gap-2 text-moon-12 text-trunks">
        {{ t("links.perPage.show") }}
        <UISelect
          size="sm"
          data-per-page
          class="w-20"
          :aria-label="t('links.perPage.label')"
          :model-value="perPage"
          @update:model-value="(value) => (perPage = Number(value))"
        >
          <option v-for="size of PAGE_SIZES" :key="size" :value="size">{{ size }}</option>
        </UISelect>
        {{ t("links.perPage.label") }}
      </div>

      <UIPagination.Root
        :page="page"
        :total="links.length"
        :items-per-page="perPage"
        :sibling-count="1"
        @update:page="(value) => (page = value)"
      >
        <UIPagination.List v-slot="{ items }" class="mt-4 flex items-center gap-1">
          <UIPagination.Prev />
          <template v-for="(item, index) in items" :key="index">
            <UIPagination.ListItem v-if="item.type === 'page'" :value="item.value" as-child>
              <UIButton size="sm" :data-page="item.value" :variant="item.value === page ? 'fill' : 'ghost'">
                {{ item.value }}
              </UIButton>
            </UIPagination.ListItem>
            <UIPagination.Elipsis v-else :index="index" />
          </template>
          <UIPagination.Next />
        </UIPagination.List>
      </UIPagination.Root>
    </UICard.Footer>
  </UICard.Root>
</template>
