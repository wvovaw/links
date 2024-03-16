<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { TagsInputItemProps } from "radix-vue";
import { TagsInputItem, TagsInputItemDelete, TagsInputItemText, useForwardProps } from "radix-vue";
import { UITag } from "../Tag";

const props = defineProps<TagsInputItemProps & {
  class?: HTMLAttributes["class"];
  size?: "sm" | "xs";
  color?: "default" | "piccolo" | "hit" | "chichi" | "krillin" | "roshi";
  variant?: "outline" | "fill";
  iconLeft?: string;
}>();

const delegatedProps = computed(() => {
  const { class: _, size: _s, color: _co, variant: _v, iconLeft: _il, ...delegated } = props;
  return delegated;
});
const forwardedProps = useForwardProps(delegatedProps);

const tagsInputConf = inject<{
  size: "sm" | "md" | "lg";
}>("tagsInput");

const tagSize = tagsInputConf?.size === "sm" ? "xs" : "sm";
</script>

<template>
  <TagsInputItem v-bind="forwardedProps" :class="[props.class]" as-child>
    <UITag
      :size="props.size ? props.size : tagSize"
      :variant="props.variant ? props.variant : 'fill'"
      :color="props.color ? props.color : 'default'"
      :icon-left="props.iconLeft"
      class="data-[state=active]:(ring-2 ring-heles ring-offset-2 ring-offset-heles scale-105 transition-transform duration-200 ease-in-out)"
    >
      <TagsInputItemText as-child>
        {{ props.value }}
      </TagsInputItemText>
      <TagsInputItemDelete class="flex data-[disabled]:cursor-not-allowed">
        <span class="i-lucide:x text-moon-14" />
      </TagsInputItemDelete>
    </UITag>
  </TagsInputItem>
</template>
