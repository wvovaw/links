---
title: Tooltip
description: A popup UI component that displays information related to the item to which the tooltip is attached when the user hovers over it.
---

# Tooltip

`Tooltip` component is component allowing to tell users more about the element they're about to interact with. It appears when user hovers over or focuses the element the Tooltip attached to.

___

## Anatomy

```vue
<template>
  <TooltipProvider>
    <Tooltip>
      <template #trigger>
        trigger
      </template>
      <template #content>
        tooltip content
      </template>
    </Tooltip>
  </TooltipProvider>
</template>
```

`TooltipProvider` is mandatory. It provides down the common options for all its children tooltips. You can wrap the whole app with this provider and set `delayDuration` and `skipDelayDuration` props. Or you can either wrap the only section to make its tooltips behavior similar.

___

## Examples

### Default

:ui-docs-tooltip-default

### Alignment

:ui-docs-tooltip-alignment

### Customization

:ui-docs-tooltip-customization

___

## API Reference

### TooltipProvider

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `delayDuration` | `number` | No | - | The duration from when the pointer enters the trigger until the tooltip gets opened. |
| `disableClosingTrigger` | `boolean` | No | - | When `true`, clicking on trigger will not close the content. |
| `disableHoverableContent` | `boolean` | No | false | When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger. |
| `skipDelayDuration` | `number` | No | 300 | How much time a user has to enter another trigger without incurring a delay again. |

### Tooltip

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `defaultOpen` | `boolean` | No | `false` | The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state. |
| `delayDuration` | `number` | No | - | Override the duration given to the `Provider` to customise the open delay for a specific tooltip. |
| `disableClosingTrigger` | `boolean` | No | - | When `true`, clicking on trigger will not close the content. |
| `disableHoverableContent` | `boolean` | No | false | When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger. |
| `open` | `boolean` | No | - | The controlled open state. |
| `attachSide` | top \| right \| bottom \| left | No | top | The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. |
| `arrowAlign` | center \| start \| end | No | center | The preferred alignment against the trigger. May change when collisions occur. |
| `sideOffset` | `number` | No | 6 | The distance in pixels from the trigger. |
| `contentClass` | `string` | No | - | The string that will be merged to the TooltipContent class attribute. |
| `arrowClass` | `string` | No | - | The string that will be merged to the TooltipArrow class attribute. |
| `noArrow` | `boolean` | No | - | When `true`, the TooltipArrow won't be rendered. |

#### Emits

| Name | Payload |
|------|---------|
| `update:open` | `[value: boolean]` Event handler called when the open state of the tooltip changes. |
