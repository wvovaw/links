<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITabs, UITabsContent, UITabsList, UITabsTrigger } from "~ui/Tabs";
</script>

<template>
  <PreviewFrame variant="outline">
    <div class="w-full flex flex-wrap justify-around gap-4">
      <UITabs default-value="2" class="bg-gohan border-(1 beerus) rounded-moon-s-sm flex flex-col max-w-xs">
        <UITabsList variant="tab" class="border-b-1 px-2 pt-2 border-beerus w-full">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2" disabled>
            Tab 2
          </UITabsTrigger>
          <UITabsTrigger value="3">
            Tab 3
          </UITabsTrigger>
        </UITabsList>
        <div class="p-4 h-[200px] overflow-y-auto">
          <UITabsContent value="1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu condimentum nulla. In fringilla sapien vitae nunc feugiat commodo. Duis id vulputate tellus, eu consectetur felis. Praesent sit amet pharetra tellus.
          </UITabsContent>
          <UITabsContent value="2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tortor dolor, feugiat quis aliquet ut, interdum a lacus. Etiam nibh velit, mattis et condimentum eget, venenatis nec odio. Curabitur et placerat leo, in vehicula sem. Suspendisse cursus odio eu sapien eleifend tincidunt id vel sem.
          </UITabsContent>
          <UITabsContent value="3">
            Praesent et libero elementum, pellentesque sapien vitae, venenatis tellus. Vivamus malesuada justo justo, gravida maximus diam varius vel. Nulla pulvinar ornare ligula id vehicula. Ut ultrices feugiat dui sed ultricies. Sed a erat eget diam cursus aliquam sit amet quis felis. Sed mauris velit, aliquet non egestas nec, vehicula a dolor.
            Etiam et commodo neque. Nullam quis auctor massa, et tempus tellus. Cras hendrerit turpis non sapien iaculis faucibus. Sed tincidunt mauris ligula, sit amet mollis mauris ultricies a. Aliquam tristique malesuada tincidunt. Nullam posuere, metus sed vestibulum congue, nisl lectus vehicula mauris, vitae gravida erat orci quis neque.
          </UITabsContent>
        </div>
      </UITabs>

      <UITabs orientation="vertical" default-value="2" class="bg-gohan border-(1 beerus) rounded-moon-s-sm max-w-sm grid grid-flow-col">
        <UITabsList variant="pill" class="border-r-1 border-beerus rounded-r-none cols-span-1 w-[80px]">
          <UITabsTrigger value="1">
            Tab 1
          </UITabsTrigger>
          <UITabsTrigger value="2" disabled>
            Tab 2
          </UITabsTrigger>
          <UITabsTrigger value="3">
            Tab 3
          </UITabsTrigger>
        </UITabsList>
        <div class="px-4 h-[240px] overflow-y-auto cols-span-2">
          <UITabsContent value="1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu condimentum nulla. In fringilla sapien vitae nunc feugiat commodo. Duis id vulputate tellus, eu consectetur felis. Praesent sit amet pharetra tellus.
          </UITabsContent>
          <UITabsContent value="2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tortor dolor, feugiat quis aliquet ut, interdum a lacus. Etiam nibh velit, mattis et condimentum eget, venenatis nec odio. Curabitur et placerat leo, in vehicula sem. Suspendisse cursus odio eu sapien eleifend tincidunt id vel sem.
          </UITabsContent>
          <UITabsContent value="3">
            Praesent et libero elementum, pellentesque sapien vitae, venenatis tellus. Vivamus malesuada justo justo, gravida maximus diam varius vel. Nulla pulvinar ornare ligula id vehicula. Ut ultrices feugiat dui sed ultricies. Sed a erat eget diam cursus aliquam sit amet quis felis. Sed mauris velit, aliquet non egestas nec, vehicula a dolor.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tortor dolor, feugiat quis aliquet ut, interdum a lacus. Etiam nibh velit, mattis et condimentum eget, venenatis nec odio. Curabitur et placerat leo, in vehicula sem. Suspendisse cursus odio eu sapien eleifend tincidunt id vel sem.
          </UITabsContent>
        </div>
      </UITabs>
    </div>
  </PreviewFrame>
</template>
