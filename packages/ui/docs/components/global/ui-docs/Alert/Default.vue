<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIAlert } from "~ui/Alerrt";
import { UIButton } from "~ui/Button";
</script>

<template>
  <PreviewFrame>
    <UIAlert.Root>
      Minimal alert
    </UIAlert.Root>
    <UIAlert.Root>
      <UIAlert.Title>With title</UIAlert.Title>
      <UIAlert.Description>And description</UIAlert.Description>
    </UIAlert.Root>
    <UIAlert.Root>
      <UIAlert.Title>
        <span class="i-lucide:info text-moon-18" />
        With title and prepend icon
      </UIAlert.Title>
      <UIAlert.Description>And description</UIAlert.Description>
    </UIAlert.Root>
    <UIAlert.Root>
      <UIAlert.Title>
        <span class="i-lucide:info text-moon-18" />
        With title and prepend icon and actions
      </UIAlert.Title>
      <UIAlert.Description>And description</UIAlert.Description>
      <UIAlert.Actions>
        <UIButton icon="i-lucide:check" variant="ghost" size="xs" color="roshi" />
        <UIButton icon="i-lucide:x" variant="ghost" size="xs" color="chichi" />
      </UIAlert.Actions>
    </UIAlert.Root>
  </PreviewFrame>
</template>
