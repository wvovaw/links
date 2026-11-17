<script setup lang="ts">
import type { BlockName } from "@links/blocks";

import { UIScrollArea, UISheet } from "@links/ui";
import { PhoneMockup } from "~shared/ui/phone-mockup";

import { useConstructorStore } from "../../model";
import { useConstructorData } from "../../model/provider";
import { BlocksList } from "../blocks-list";
import { LinkNamePreview } from "../link-name-preview";
import PageRenderer from "./page-renderer.vue";

const { isMobile, selectView } = useConstructorData();
const { addBlock } = useConstructorStore();

/* The gap a palette pick will insert into; the marker that was clicked sets it. */
const insertIndex = ref<number | null>(null);
const isPaletteOpen = ref(false);

function openPalette(index: number) {
  insertIndex.value = index;
  isPaletteOpen.value = true;
}

function insertBlock(name: BlockName) {
  addBlock(name, insertIndex.value ?? undefined);
  selectView("blocks");
  isPaletteOpen.value = false;
}
</script>

<template>
  <div class="h-full min-h-0 flex-auto">
    <UIScrollArea class="h-full" bar-class="rounded-none" thumb-class="bg-trunks">
      <div class="grid w-full place-content-center md:py-2">
        <LinkNamePreview />
        <PageRenderer v-if="isMobile" @insert="openPalette" />
        <PhoneMockup v-else>
          <PageRenderer class="rounded-40px" @insert="openPalette" />
        </PhoneMockup>
      </div>
    </UIScrollArea>
    <UISheet.Root v-model:open="isPaletteOpen">
      <UISheet.Content side="left">
        <UISheet.Header>
          <UISheet.Title>Add Block</UISheet.Title>
          <UISheet.Subtitle>Select a block to add</UISheet.Subtitle>
        </UISheet.Header>
        <BlocksList @select="insertBlock" />
      </UISheet.Content>
    </UISheet.Root>
  </div>
</template>
