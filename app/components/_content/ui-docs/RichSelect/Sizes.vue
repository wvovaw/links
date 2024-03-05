<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRichSelect } from "~ui/RichSelect";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex flex-row flex-wrap gap-4 justify-around">
      <UIRichSelect.Root>
        <UIRichSelect.Trigger size="sm" class="max-w-54">
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

      <UIRichSelect.Root>
        <UIRichSelect.Trigger size="md" color="hit" class="max-w-54">
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

      <UIRichSelect.Root>
        <UIRichSelect.Trigger size="lg" class="max-w-54">
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
    </div>
  </PreviewFrame>
</template>
