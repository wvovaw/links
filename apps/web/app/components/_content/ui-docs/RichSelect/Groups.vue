<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRichSelect } from "~ui/RichSelect";
</script>

<template>
  <PreviewFrame>
    <UIRichSelect.Root>
      <UIRichSelect.Trigger class="max-w-54">
        <UIRichSelect.Value placeholder="Select a gift 🎁" />
      </UIRichSelect.Trigger>
      <UIRichSelect.Content>
        <UIRichSelect.Group>
          <UIRichSelect.GroupLabel>Food</UIRichSelect.GroupLabel>
          <UIRichSelect.Item value="cake">
            Cake 🍰
          </UIRichSelect.Item>
          <UIRichSelect.Item value="croissant">
            Croissant 🥐
          </UIRichSelect.Item>
        </UIRichSelect.Group>
        <UIRichSelect.Group>
          <UIRichSelect.GroupLabel>Toys</UIRichSelect.GroupLabel>
          <UIRichSelect.Item value="car">
            Car 🚗
          </UIRichSelect.Item>
          <UIRichSelect.Item value="truck">
            Truck 🚛
          </UIRichSelect.Item>
        </UIRichSelect.Group>
      </UIRichSelect.Content>
    </UIRichSelect.Root>
  </PreviewFrame>
</template>
