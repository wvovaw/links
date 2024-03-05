<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  SelectItem,
  SelectItemIndicator,
  type SelectItemProps,
  SelectItemText,
  useForwardProps,
} from "radix-vue";
import { UIMenu } from "../../Menu";

const props = defineProps<SelectItemProps & { class?: HTMLAttributes["class"] }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="[props.class]"
    class="p-1 outline-none group"
  >
    <UIMenu.Item>
      <UIMenu.Title>
        <SelectItemText><slot /></SelectItemText>
      </UIMenu.Title>
      <SelectItemIndicator>
        <span class="block i-lucide:check h-4 w-4 text-bulma" />
      </SelectItemIndicator>
    </UIMenu.Item>
  </SelectItem>
</template>
