---
title: Rich Select
description: A UI component displaying ilst of options for the user to pick from.
---

# Rich Select

`RichSelect` component is a more user friendly and nice looking alternative to select component.

___

## Anatomy

```vue
<template>
  <RichSelect.Root>
    <RichSelect.Trigger>
      <RichSelect.Value />
    </RichSelect.Trigger>
    <RichSelect.Content>
      <RichSelect.Item value="item">
        Item
      </RichSelect.Item>
    </RichSelect.Content>
  </RichSelect.Root>
</template>
```
___

## Examples

### Default

:ui-docs-rich-select-default

### Sizes

:ui-docs-rich-select-sizes

### With Scroll

:ui-docs-rich-select-scroll

### Grouped Items

:ui-docs-rich-select-groups

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `autocomplete` | `boolean` | No | - | Native html input `autocomplete` attribute. |
| `defaultOpen` | `boolean` | No | - | The open state of the select when it is The open state of the select when it is initially rendered. Use when you do not need to control its open state. |
| `defaultValue` | `string` | No | "" | The value of the select when initially rendered. Use when you do not need to control the state of the Select. |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.\nIf omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `modelvalue` | `string` | No | - | The controlled value of the Select. Can be bound with `v-model` |
| `name` | `string` | No | - | The name of the Select. Submited with its owning form as part of a name/value pair. |
| `open` | `boolean` | No | - | The controlled open state of the Select. Can be bound with `v-model:open`. |
| `required` | `boolean` | No | - | When `true`, indicates that the user must select a value before the owning form can be submited. |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[value: string]` Event handler called when the valie changes. |
| `update:open` | `[value: boolean]` Event handler called when the open state changes. |

### Trigger

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-disabled]` | Present when disabled |
| `[data-placeholder]` | Present when has placeholder |

### Value

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `placeholder` | `string` | No | - | The content that will be rendered inside when  no `value` or `defaultValue` is set. |

### Content

### Props

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
| `position` | popover \| item-aligned | No | - | The positioning mode to use<br>`item-aligned` (default) - behaves similarly to a native MacOS menu by positioning content relative to the active item.<br>`popper` - positions content in the same way as other Radix-Vue primitives, for example `Popover` or `DropdownMenu`.
| `prioritizePosition` | `boolean` | No | - | Force content to be position within the viewport.<br>Might overlap the reference element, which may not be desired. |
| `side` | top \| right \| bottom \| left | No | - | The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled. |
| `sideOffset` | `number` | No | - | The distance in pixels from the trigger. |
| `sticky` | partial \| always | No | - | The sticky behavior on the align axis. `partial` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst "always" will keep the content in the boundary regardless. |
| `updatePositionStrategy` | always \| optimized | No | - | Strategy to update the position of the floating element on every animation frame. |

#### Emits

| Name | Payload |
|------|---------|
| `closeAutoFocus` | `[event: Event]` Event handler called when auto-focusing on close. Can be prevented. |
| `escapeKeyDown` | `[event: KeyboardEvent]` Event handler called when the escape key is down. Can be prevented. |
| `pointerDownOutside` | `[event: PointerDownOutsideEvent]` | Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`. Can be prevented. |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-side]` | "left" \| "right" \| "bottom" \| "top" |
| `[data-align]` | "start" \| "end" \| "center" |

### Item

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `textValue` | `string` | No | Optional text used for typehead purposes. |
| `value` | `string` | Yes | The value given as data when submited with a `name`. |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "checked" \| "unchecked" |
| `[data-highlighted]` | Present when highlighted |
| `[data-disabled]` | Present when disabled |
___

## Other

For more details refer to [Radix-Vue Popover docs](https://www.radix-vue.com/components/select.html).
