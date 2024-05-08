<script setup lang="ts">
import { BlockPropertiesEditor } from "./ui/BlockPropertiesEditor";
import { Toolbar } from "./ui/toolbar";
import { Workspace } from "./ui/Workspace";
import { useConstructorStore } from "./model";
import { LinksApi } from "~shared/api/appwrite";

const props = defineProps<{
  linkId: string;
}>();

const constructorStore = useConstructorStore();
const { setBlocks, setTitle, setId } = constructorStore;

try {
  const data = await LinksApi.getLink(props.linkId);
  if (data) {
    setId(data.$id);
    setBlocks(JSON.parse(data.blocks));
    setTitle(data.title);
  }
}
catch (e: unknown) {
  if (e instanceof Error) {
    throw createError({
      statusCode: 404,
      statusMessage: e.message,
    });
  }
}
</script>

<template>
  <div class="h-[calc(100vh-var(--navbar-height,64px))] w-100vw flex flex-col-reverse md:flex-row">
    <Toolbar class="min-w-full inline-flex items-center justify-center bg-gohan p-2 shadow-moon-lg md:min-h-full md:min-w-fit" />
    <BlockPropertiesEditor class="hidden border-(x beerus) bg-gohan md:block lg:max-w-sm lg:min-w-sm" />
    <Workspace class="flex-auto" />
  </div>
</template>
