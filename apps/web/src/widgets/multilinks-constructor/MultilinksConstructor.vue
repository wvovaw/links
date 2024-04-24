<script setup lang="ts">
import { UIScrollArea } from "@links/ui";
import { BlockPropertiesEditor } from "./ui/BlockPropertiesEditor";
import { BlocksList } from "./ui/BlocksList";
import { Workspace } from "./ui/Workspace";
import { useConstructorStore } from "./model";

const store = useConstructorStore();
const { addBlock } = store;
</script>

<template>
  <div class="grid h-[calc(100vh-var(--navbar-height,64px))] w-100vw lg:grid-cols-[minmax(320px,320px)_minmax(320px,1fr)_minmax(320px,320px)]">
    <UIScrollArea class="hidden lg:block" bar-class="rounded-none" thumb-class="bg-trunks">
      <BlocksList
        @add-block="(name) => addBlock(name)"
      />
    </UIScrollArea>
    <UIScrollArea class="lg:border-(x beerus)" bar-class="rounded-none" thumb-class="bg-trunks">
      <Workspace />
    </UIScrollArea>
    <UIScrollArea class="hidden lg:block" bar-class="rounded-none" thumb-class="bg-trunks">
      <BlockPropertiesEditor />
    </UIScrollArea>
  </div>
</template>
