---
title: Toggle Group
description: A UI component ToggleGroup is a container for grouping multiple Toggle components.
---

# Toggle Group

A `Toggle Group` is basically a [Toggle components](/docs/components/toggle) grouped by one context. It can provide the common visuals and context to child Toggle components. Here's an example of [single](#singular) and [multiple](#multiple) model values.

___

## Anatomy

```vue
<template>
  <ToggleGroup>
    <ToggleGroupItem />
  </ToggleGroup>
</template>
```

## Examples

### Singular

:ui-docs-toggle-group-singular

### Multiple

:ui-docs-toggle-group-multiple

### Vertical

:ui-docs-toggle-group-vertical

> Notice this has `orientation = vertical` set explicitly. That means that only up/down arrows will cycle through the items.

> It allso has `size = sm` set on a provider element, and colors set explicitly for each element.

### Custom Items Layout

:ui-docs-toggle-group-custom-layout

> Feel free to override default styles of the root if you need different view.

___

## API Reference

### Group

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `type` | single \| multiple | No | single | Determines whether a single or multiple items can be pressed at a time |
| `modelvalue` | `string \| string[]` | No | - | The controlled value of the pressed item. Can be bind as `v-model` |
| `defaultValue` | `string \| string[]` | No | - | The value of the item to show as pressed when initially rendered. Use when you do not need to control the state of the items |
| `loop` | `boolean` | No | true | When `loop` and `rovingFocus` is `true`, keyboard navigation will loop from last item to first, and vice versa |
| `rovingFocus` | `boolean` | No | `true` | When `false`, navigating through the items using arrow keys will be disabled |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.\nIf omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `variant` | default \| ghost | No | default | Variant of a visual look of a toggle items |
| `size` | sm \| md | No | md | Toggle items size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Toggle items color |
| `withStroke` | `boolean` | No | - | If `true`, toggle items will have stroke line when `hover:` and `data-state="on"` |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string]` Event handler called when the value changes |

#### Slots

default

| Name | Payload |
|------|---------|
| `modelValue` | `string \| string[] \| undefined` Current toggle values |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-orientation]` | "vertical" \| "horizontal" |

### Item

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultValue ` | `boolean` | No | - | The pressed state of the toggle when it is initially rendered. Use when you do not need to control its open state |
| `value` | `string` | Yes | - | A string value for the toggle group item. All items within a toggle group should use a unique value. |
| `pressed ` | `boolean` | No | - | The controlled pressed state of the toggle. Can be bind as `v-model` |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `variant ` | default \| ghost | No | default | Variant of a visual look of a toggle |
| `size ` | sm \| md | No | md | Toggle item size |
| `color ` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Toggle item color |
| `icon ` | `string` | No | - | Iconify icon name |
| `iconPos ` | left \| right | No | left | Icon will be placed on the **left** or **right** from children content |
| `withStroke ` | `boolean` | No | - | If `true`, toggle will have stroke line when `hover:` and `data-state="on"` |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "on" \| "off" |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | "vertical" \| "horizontal" |

___

## Accessibility

Uses [roving tabindex](https://www.w3.org/TR/wai-aria-practices-1.2/examples/radio/radio.html) to manage focus movement among items.

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | Moves focus to either the pressed item or the first item in the group |
| `Space` | Activates/deactivates the item |
| `Enter` | Activates/deactivates the item |
| `ArrowDown` | Moves focus to the next item in the group |
| `ArrowRight` | Moves focus to the next item in the group |
| `ArrowUp` | Moves focus to the previous item in the group |
| `ArrowLeft` | Moves focus to the previous item in the group |
| `Home` | Moves focus to the first item |
| `End` | Moves focus to the last item |
