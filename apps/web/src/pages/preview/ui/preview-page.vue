<script setup lang="ts">
import type { ILinkPageDocument } from "~shared/api/appwrite";
import { LinksApi } from "~shared/api/appwrite";
import { useBlocksResolver } from "~shared/core";
import "~shared/core/resources/theme.css";

const props = defineProps<{
  linkId: string;
}>();

const blocks = ref<ILinkPageDocument>();
const background = ref<string>();

onMounted(async () => {
  const linkData = await LinksApi.getLink(props.linkId);
  try {
    if (linkData?.blocks)
      blocks.value = JSON.parse(linkData?.blocks);
    if (linkData?.background)
      background.value = linkData.background;
  }
  catch (e: unknown) {
    console.error("Couldn't deserialize blocks data field");
  }
  console.log(blocks.value);
});

const { resolve } = useBlocksResolver();
</script>

<template>
  <div class="h-100vh flex flex-col">
    <div class="link" :style="background">
      <div class="link__container">
        <div class="link__blocks-root">
          <component
            :is="resolve(block.name)"
            v-for="block of blocks"
            :id="`block-${block.id}`"
            :key="block.id"
            :properties="block.properties"
          />
        </div>
      </div>
    </div>
  </div>
</template>
