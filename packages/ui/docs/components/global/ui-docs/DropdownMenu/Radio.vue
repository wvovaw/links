<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UIDropdownMenu } from "~ui/DropdownMenu";
import { UIButton } from "~ui/Button";

const radios = [
  { value: "left", icon: "i-lucide:arrow-big-left" },
  { value: "top", icon: "i-lucide:arrow-big-up" },
  { value: "right", icon: "i-lucide:arrow-big-right" },
  { value: "bottom", icon: "i-lucide:arrow-big-down" },
];
const val = ref(radios[0].value);
</script>

<template>
  <PreviewFrame>
    <span class="w-full">Chosen: {{ val }}</span>
    <UIDropdownMenu.Root>
      <UIDropdownMenu.Trigger as-child>
        <UIButton>Open</UIButton>
      </UIDropdownMenu.Trigger>
      <UIDropdownMenu.Content>
        <UIDropdownMenu.RadioGroup v-model="val">
          <UIDropdownMenu.Label>
            <span>Choose Direction</span>
          </UIDropdownMenu.Label>
          <UIDropdownMenu.Separator />
          <UIDropdownMenu.RadioItem
            v-for="item of radios"
            :key="item.value"
            :value="item.value"
            color="piccolo"
          >
            <span :class="item.icon" class="block" />
            <UIDropdownMenu.ItemTitle class="capitalize">
              {{ item.value }}
            </UIDropdownMenu.ItemTitle>
          </UIDropdownMenu.RadioItem>
        </UIDropdownMenu.RadioGroup>
      </UIDropdownMenu.Content>
    </UIDropdownMenu.Root>
  </PreviewFrame>
</template>
