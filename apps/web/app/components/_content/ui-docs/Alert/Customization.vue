<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAlert } from "~ui/Alerrt";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame variant="outline">
    <UIAlert.Root class="bg-heles">
      <UIAlert.Title>
        <span class="i-lucide:info text-moon-18" />
        Example 1
      </UIAlert.Title>
      <UIAlert.Description>With custom background color</UIAlert.Description>
      <UIAlert.Actions>
        <UIButton icon="i-lucide:x" variant="ghost" size="xs" />
      </UIAlert.Actions>
    </UIAlert.Root>

    <UIAlert.Root class="border border-beerus">
      <UIAlert.Title>
        <span class="i-lucide:info text-moon-18" />
        Example 2
      </UIAlert.Title>
      <UIAlert.Description>Outline with border</UIAlert.Description>
      <UIAlert.Actions>
        <UIButton icon="i-lucide:x" variant="ghost" size="xs" />
      </UIAlert.Actions>
    </UIAlert.Root>

    <UIAlert.Root class="bg-chichi-10! border border-chichi text-chichi">
      <UIAlert.Title>
        <span class="i-lucide:alert-octagon text-moon-18" />
        Example 3
      </UIAlert.Title>
      <UIAlert.Description>Danger variant</UIAlert.Description>
      <UIAlert.Actions>
        <UIButton icon="i-lucide:x" variant="outline" size="xs" color="chichi" />
      </UIAlert.Actions>
    </UIAlert.Root>
  </PreviewFrame>
</template>
