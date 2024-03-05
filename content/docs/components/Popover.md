---
title: Popover
description: A UI component displaying rich content in a portal.
---

# Popover

`Popover` is a UI component displaying rich content in a portal.

## Anatomy

```vue
<template>
  <Popover>
    <PopoverTrigger />
    <PopoverContent>
      <PopoverArrow />
    </PopoverContent>
  </Popover>
</template>
```

## Examples

:ui-docs-popover-default{title="Default"}

:ui-docs-popover-sides{title="Side"}

:ui-docs-popover-with-scroll{title="With Scroll"}

___

## API Reference

### Popover

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `defaultOpen` | `boolean` | No | false | The open state of the popover when it is initially rendered. Use when you don't need to control its open state. |
| `modal` | `boolean` | No | false | The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers. |
| `open` | `boolean` | No | - | The controlled open state of the popover |

#### Emits

| Name | Payload |
|------|---------|
| `update:open` | `[value: boolean]` Event called when the open state of the popover changes. |

### PopoverTrigger

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |

### PopoverContent

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `align` | start \| center \| end | No | - | The preferred alignment against the trigger. May change when collisions occur. |
| `alignOffset` | `number` | No | - | An offset in pixels from the start or end alignment options. |
| `arrowPadding` | `number` | No | - | The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners. |
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `avoidCollisions` | `boolean` | No | - | When `true`, overrides the side and align preferences to prevent collisions with boundary edges. |
| `collisionBoundary` | `Element \| (Element \| null)[] | null` | No | - | The Distance The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check. |
| `collisionPadding` | `number` \| Partial<Record<'top' \| 'right' \| 'bottom' \| 'left', number>> | No | - | TheThe distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: { top: 20, left: 20 }. |
| `forceMount` | `boolean` | No | - | Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. |
| `hideWhenDetached` | `boolean` | No  | - | Whether to hide the content when the trigger becomes fully occluded. |
| `prioritizePosition` | `boolean` | No | - | Force content to be position within the viewport.<br>Might overlap the reference element, which may not be desired. |
| `side` | top \| right \| bottom \| left | No | - | The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. |
| `sideOffset` | `number` | No | - | The distance in pixels from the trigger. |
| `sticky` | partial \| always | No | - | The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. |
| `trapFocus` | `boolean` | No | - | Whether focus should be trapped within the `PopoverContent` |
| `updatePositionStrategy` | always \| optimized | No | - | Strategy to update the position of the floating element on every animation frame. |

#### Emits

| Name | Payload |
|------|---------|
| `closeAutoFocus` | `[event: Event]` Event handler called when auto-focusing on close. Can be prevented. |
| `escapeKeyDown` | `[event: KeyboardEvent]` Event handler called when the escape key is down. Can be prevented. |
| `focusOutside` | `[event: FocusOutsideEvent]` | Event handler called when the focus moves outside of the `DismissableLayer`. Can be prevented. |
| `interactOutside` | `[event: PointerDownOutsideEvent | FocusOutsideEvent]` | Event handler called when an interaction happens outside the `DismissableLayer`. Specifically, when a `pointerdown` event happens outside or focus moves outside of it. Can be prevented. |
| `openAutoFocus` | `[event: Event]` | Event handler called when auto-focusing on open. Can be prevented. |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` | Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-side]` | "left" \| "right" \| "bottom" \| "top" |
| `[data-align]` | "start" \| "end" \| "center" |

___

## Accessibility

Adheres to the [Dialog WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal).

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Space` | Opens/closes the popover. |
| `Enter` | Opens/closes the popover. |
| `Tab` | Moves focus to the next focusable element |
| `Shift` + Tab | Moves focus to the previous focusable element |
| `Esc` | Closes the popover and moves focus to `PopoverTrigger`. |

___

For more details refer to [Radix-Vue Popover docs](https://www.radix-vue.com/components/popover.html).
