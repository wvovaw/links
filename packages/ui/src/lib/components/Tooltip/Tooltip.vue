<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TooltipArrow, TooltipContent, type TooltipContentProps, TooltipRoot, type TooltipRootEmits, type TooltipRootProps, TooltipTrigger, useForwardPropsEmits } from "radix-vue";

const props = withDefaults(defineProps<TooltipRootProps & {
  contentClass?: HTMLAttributes["class"];
  arrowClass?: HTMLAttributes["class"];
  attachSide?: TooltipContentProps["side"];
  arrowAlign?: TooltipContentProps["align"];
  sideOffset?: TooltipContentProps["sideOffset"];
  noArrow?: boolean;
}>(), {
  attachSide: "top",
  arrowAlign: "center",
  sideOffset: 6,
});
const emits = defineEmits<TooltipRootEmits>();

const delegatedProps = computed(() => {
  const { contentClass: _ccl, arrowClass: _acl, attachSide: _si, arrowAlign: _al, sideOffset: _so, ...delegated } = props;
  return delegated;
});
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TooltipRoot v-bind="forwarded">
    <TooltipTrigger as-child>
      <slot name="trigger" />
    </TooltipTrigger>
    <TooltipContent
      :side="props.attachSide"
      :align="props.arrowAlign"
      :side-offset="props.sideOffset"
      class="z-10 animate-in data-[state=closed]:(animate-out fade-out-0 zoom-out-95) rounded-moon-s-xs bg-goku p-3 text-moon-12 text-bulma shadow-[0_6px_6px_-6px_rgba(0,0,0,0.16)] drop-shadow-[0_0_1px_rgba(0,0,0,0.4)] fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      :class="props.contentClass"
    >
      <slot name="content" />
      <TooltipArrow v-if="!noArrow" :width="11" :height="5" class="fill-goku" :class="props.arrowClass" />
    </TooltipContent>
  </TooltipRoot>
</template>
