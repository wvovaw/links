<script setup lang="ts">
import { UIScrollArea, UISheet } from "@links/ui";
import { VisuallyHidden } from "reka-ui";
import { useConfirmation } from "~shared/ui/confirmation-dialog";

import type { PanelViewId } from "./model/provider";

import { useConstructorStore } from "./model";
import { CONSTRUCTOR_INJECTION_KEY } from "./model/provider";
import { DEFAULT_VIEW_ID, PROPERTY_VIEWS } from "./ui/properties-panel/views";
import { Toolbar } from "./ui/toolbar";
import { Workspace } from "./ui/workspace";

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
    if (isCanceled) return false;
  }
  return true;
});

const isMobile = useMediaQuery("(max-width: 767px)");

const activeViewId = ref<PanelViewId>(DEFAULT_VIEW_ID);
const activeView = computed(() => PROPERTY_VIEWS.find((view) => view.id === activeViewId.value) ?? PROPERTY_VIEWS[0]!);
const isPanelOpen = ref(false);

function selectView(view: PanelViewId) {
  activeViewId.value = view;
}

/** A toolbar press asks to see the view; on mobile that means opening the sheet it renders in. */
function chooseView(view: PanelViewId) {
  selectView(view);
  if (isMobile.value) isPanelOpen.value = true;
}

provide(CONSTRUCTOR_INJECTION_KEY, {
  isMobile,
  selectView,
});
</script>

<template>
  <div class="h-[calc(100vh-var(--navbar-height,64px))] w-100vw flex flex-col-reverse md:flex-row">
    <Toolbar
      class="min-w-full inline-flex items-center justify-center bg-gohan p-2 shadow-moon-lg md:min-h-full md:min-w-fit"
      :active-view-id="activeViewId"
      @select="chooseView"
    />
    <UIScrollArea
      v-if="!isMobile"
      orientation="vertical"
      class="border-(x beerus) bg-gohan p-2 lg:max-w-sm lg:min-w-sm"
      bar-class="rounded-none"
      thumb-class="bg-trunks"
    >
      <component :is="activeView.component" />
    </UIScrollArea>
    <UISheet.Root v-else v-model:open="isPanelOpen">
      <UISheet.Content side="bottom" class="max-h-[85vh] overflow-y-auto">
        <UISheet.Header>
          <UISheet.Title>{{ activeView.label }}</UISheet.Title>
          <VisuallyHidden>
            <UISheet.Subtitle>Properties of this page</UISheet.Subtitle>
          </VisuallyHidden>
        </UISheet.Header>
        <component :is="activeView.component" />
      </UISheet.Content>
    </UISheet.Root>
    <Workspace />
  </div>
</template>
