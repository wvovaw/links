<script setup lang="ts">
import { UITable, UITag } from "@links/ui";
import LinkActions from "./link-actions.vue";
import EmptyState from "./empty-state.vue";
import { CreateNewLinkDialog, useLinksStore } from "~entities/links";
import { CreateNewLinkForm } from "~features/links";

const linksStore = useLinksStore();
const { links } = storeToRefs(linksStore);
</script>

<template>
  <div
    class="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-10"
  >
    <UITable.Root class="mx-auto max-w-4xl w-full overflow-hidden rounded-moon-s-md bg-gohan shadow-moon-sm">
      <UITable.Header>
        <UITable.Head>Id</UITable.Head>
        <UITable.Head>Title</UITable.Head>
        <UITable.Head>Status</UITable.Head>
        <UITable.Head>Actions</UITable.Head>
      </UITable.Header>
      <UITable.Body>
        <UITable.Row v-if="links.length < 1" class="hover:bg-transparent">
          <UITable.Cell colspan="100%">
            <EmptyState>
              <div class="mt-6">
                <CreateNewLinkDialog>
                  <!-- TODO: Make the form KeepAlive within dialog between it's open/close states -->
                  <CreateNewLinkForm />
                </CreateNewLinkDialog>
              </div>
            </EmptyState>
          </UITable.Cell>
        </UITable.Row>

        <UITable.Row
          v-for="link of links" :key="link.id"
        >
          <UITable.Cell>{{ link.id }}</UITable.Cell>
          <UITable.Cell class="w-full font-semibold">
            {{ link.title }}
          </UITable.Cell>
          <UITable.Cell>
            <UITag
              class="w-fit"
              :variant="link.status === 'DRAFT' ? 'outline' : 'fill'"
            >
              {{ link.status }}
            </UITag>
          </UITable.Cell>
          <UITable.Cell>
            <LinkActions :link-id="link.$id" />
          </UITable.Cell>
        </UITable.Row>
      </UITable.Body>
    </UITable.Root>
    <div v-if="links.length > 0" class="flex justify-center">
      <CreateNewLinkDialog>
        <!-- TODO: Make the form KeepAlive within dialog between it's open/close states -->
        <CreateNewLinkForm />
      </CreateNewLinkDialog>
    </div>
  </div>
</template>
