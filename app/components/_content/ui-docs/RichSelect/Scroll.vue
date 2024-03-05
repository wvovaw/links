<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIRichSelect } from "~ui/RichSelect";
</script>

<template>
  <PreviewFrame>
    <div class="w-full flex flex-row flex-wrap gap-4 justify-around">
      <div class="w-54">
        <UIRichSelect.Label for="scroll-00">
          Aligned as "popper"
        </UIRichSelect.Label>
        <UIRichSelect.Root id="scroll-00">
          <UIRichSelect.Trigger>
            <UIRichSelect.Value placeholder="Choose a number" />
          </UIRichSelect.Trigger>
          <UIRichSelect.Content>
            <UIRichSelect.Group>
              <UIRichSelect.Item
                v-for="(el, ix) of Array.from({ length: 20 }, (_, i) => i)"
                :key="ix"
                :value="String(ix)"
              >
                {{ el }}
              </UIRichSelect.Item>
            </UIRichSelect.Group>
          </UIRichSelect.Content>
        </UIRichSelect.Root>
        <UIRichSelect.Hint>This will be alligned to one of the sides of the trigger</UIRichSelect.Hint>
      </div>

      <div class="w-54">
        <UIRichSelect.Label for="scroll-01">
          Aligned as "item-aligned"
        </UIRichSelect.Label>
        <UIRichSelect.Root id="scroll-01">
          <UIRichSelect.Trigger>
            <UIRichSelect.Value placeholder="Choose a number" />
          </UIRichSelect.Trigger>
          <UIRichSelect.Content position="item-aligned">
            <UIRichSelect.Group>
              <UIRichSelect.Item
                v-for="(el, ix) of Array.from({ length: 20 }, (_, i) => i)"
                :key="ix"
                :value="String(ix)"
              >
                {{ el }}
              </UIRichSelect.Item>
            </UIRichSelect.Group>
          </UIRichSelect.Content>
        </UIRichSelect.Root>
        <UIRichSelect.Hint>Content list will be aligned "item-to-trigger"</UIRichSelect.Hint>
      </div>
    </div>
  </PreviewFrame>
</template>
