<script setup lang="ts">
import { UIScrollArea, UITabs, UITabsContent, UITabsList, UITabsTrigger } from "@links/ui";
import { BlockPropertiesEditor } from "./ui/block-properties-editor";
import { PagePropertiesEditor } from "./ui/page-properties-editor";
import { Toolbar } from "./ui/toolbar";
import { Workspace } from "./ui/Workspace";
import { useConstructorStore } from "./model";
import { CONSTRUCTOR_INJECTION_KEY } from "./model/provider";
import { useConfirmation } from "~shared/ui/confirmation-dialog";

const props = defineProps<{
  linkId: string;
}>();

const { createConfirmation } = useConfirmation();
const constructorStore = useConstructorStore();
const { setupStore, hasUnsavedChanges } = constructorStore;

await setupStore(props.linkId);

onBeforeRouteLeave(async () => {
  if (hasUnsavedChanges()) {
    const confirm = createConfirmation({
      title: "Changes will be lost",
      subtitle: "You have unsaved changes",
      content: "Do you want to leave the page without save?",
    });
    const { isCanceled } = await confirm();
    if (isCanceled)
      return false;
  }
  return true;
});

const isMobile = useMediaQuery("(max-width: 767px)");
provide(CONSTRUCTOR_INJECTION_KEY, {
  isMobile,
});
</script>

<template>
  <div class="h-[calc(100vh-var(--navbar-height,64px))] w-100vw flex flex-col-reverse md:flex-row">
    <Toolbar class="min-w-full inline-flex items-center justify-center bg-gohan p-2 shadow-moon-lg md:min-h-full md:min-w-fit" />
    <UIScrollArea
      v-if="!isMobile"
      class="border-(x beerus) bg-gohan p-2 lg:max-w-sm lg:min-w-sm"
      bar-class="rounded-none" thumb-class="bg-trunks"
    >
      <UITabs default-value="1">
        <UITabsList variant="tab">
          <UITabsTrigger value="1">
            Block Properties
          </UITabsTrigger>
          <UITabsTrigger value="2">
            Page properties
          </UITabsTrigger>
        </UITabsList>
        <UITabsContent value="1">
          <BlockPropertiesEditor />
        </UITabsContent>
        <UITabsContent value="2">
          <PagePropertiesEditor />
        </UITabsContent>
      </UITabs>
    </UIScrollArea>
    <Workspace class="flex-auto" />
  </div>
</template>
