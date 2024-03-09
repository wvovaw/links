<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";

const checkboxes = reactive([
  { value: "tomato", chosen: false },
  { value: "onion", chosen: false },
  { value: "cheese", chosen: false },
  { value: "jalapeno", chosen: false },
]);
const choosen = computed(() => checkboxes.filter(ch => ch.chosen));
const chosenStr = computed(() => choosen.value.map(ch => ch.value).join(", "));
</script>

<template>
  <PreviewFrame>
    <span class="w-full">Ingredients: {{ chosenStr }}</span>
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content>
        <UIDropdownMenu.Group>
          <UIDropdownMenu.Label>
            <span>Choose Direction</span>
          </UIDropdownMenu.Label>
          <UIDropdownMenu.Separator />
          <UIDropdownMenu.CheckboxItem
            v-for="item of checkboxes"
            :key="item.value"
            v-model:checked="item.chosen"
            color="piccolo"
          >
            <UIDropdownMenu.ItemTitle class="capitalize">
              {{ item.value }}
            </UIDropdownMenu.ItemTitle>
          </UIDropdownMenu.CheckboxItem>
        </UIDropdownMenu.Group>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </PreviewFrame>
</template>
