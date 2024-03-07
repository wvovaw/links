<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAccordion } from "~ui/Accordion";
</script>

<template>
  <PreviewFrame class="py-10">
    <UIAccordion.Root collapsible class="w-sm space-y-2">
      <UIAccordion.Item value="item-1">
        <UIAccordion.Trigger size="sm">
          Small (sm)
        </UIAccordion.Trigger>
        <UIAccordion.Content>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime minima dolores aperiam cupiditate totam! Velit dolorem quos illum iure autem!
        </UIAccordion.Content>
      </UIAccordion.Item>

      <UIAccordion.Item value="item-2">
        <UIAccordion.Trigger size="md">
          Medium (md) - default
        </UIAccordion.Trigger>
        <UIAccordion.Content>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae, libero cupiditate impedit sunt maiores expedita aperiam id iure similique repellendus veniam quasi culpa amet? Commodi?
        </UIAccordion.Content>
      </UIAccordion.Item>

      <UIAccordion.Item value="item-3">
        <UIAccordion.Trigger size="lg">
          Large (lg)
        </UIAccordion.Trigger>
        <UIAccordion.Content>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit ipsam illum dolorum dignissimos dolor aliquam sed consequatur fugit nostrum dolore, necessitatibus ea eligendi facere laudantium. Repellendus illo molestiae nostrum dolore.
        </UIAccordion.Content>
      </UIAccordion.Item>

      <UIAccordion.Item value="item-4">
        <UIAccordion.Trigger size="xl">
          X Large (xl)
        </UIAccordion.Trigger>
        <UIAccordion.Content>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus iure accusantium, quo, repudiandae quisquam exercitationem nihil eius ex alias modi veniam maiores totam quis assumenda sint aut fugiat, iusto voluptatibus facilis magnam aspernatur fugit? Earum voluptates error distinctio quis itaque!
        </UIAccordion.Content>
      </UIAccordion.Item>
    </UIAccordion.Root>
  </PreviewFrame>
</template>
