<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRichSelect } from "~ui/RichSelect";
</script>

<template>
  <PreviewFrame>
    <UIRichSelect.Root>
      <UIRichSelect.Trigger>
        <UIRichSelect.Value placeholder="Select a fruit" />
      </UIRichSelect.Trigger>

      <UIRichSelect.Content>
        <UIRichSelect.Item value="apple">
          Apple 🍏
        </UIRichSelect.Item>
        <UIRichSelect.Item value="mango">
          Mango 🥭
        </UIRichSelect.Item>
        <UIRichSelect.Item value="pineapple">
          Pineapple 🍍
        </UIRichSelect.Item>
        <UIRichSelect.Item value="orange">
          Orange 🍊
        </UIRichSelect.Item>
      </UIRichSelect.Content>
    </UIRichSelect.Root>
  </PreviewFrame>
</template>
