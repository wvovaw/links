<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DropdownMenuItemIndicator, DropdownMenuRadioItem, type DropdownMenuRadioItemEmits, type DropdownMenuRadioItemProps, useForwardPropsEmits } from "radix-vue";
import { Item as MenuItem } from "../../Menu/namespace";
import { UIRadioItem } from "../../RadioItem";

const props = defineProps<DropdownMenuRadioItemProps & {
  class?: HTMLAttributes["class"];
  // FIXME: This need to be exported from UIRadioItem as UIRadioItemProps
  color?: "default" | "piccolo" | "hit" | "roshi" | "chichi" | "krillin";
}>();
const emits = defineEmits<DropdownMenuRadioItemEmits>();
const delegatedProps = computed(() => {
  const { class: _, color: _co, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DropdownMenuRadioItem
    v-bind="forwarded"
    :class="[
      props.class,
    ]"
    as-child
  >
    <MenuItem class="group">
      <slot />
      <UIRadioItem.Root :disabled="disabled" :color="color">
        <DropdownMenuItemIndicator as-child>
          <UIRadioItem.Indicator />
        </DropdownMenuItemIndicator>
      </UIRadioItem.Root>
    </MenuItem>
  </DropdownMenuRadioItem>
</template>
