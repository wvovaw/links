---
title: Tabs
description: A UI component allowing user to switch between content sections that displayed one at a time.
---

# Tabs

Tabs is a component allowing users to navigate between views within the same context. Only one content associated with the selected tab displayed at a time.

___

## Anatomy

::ui-docs-code-block{filename="Tabs.vue" lang="vue"}
```vue
<template>
  <Tabs>
    <TabsList>
      <TabsTrigger value="1"> 1 </TabsTrigger>
      <TabsTrigger value="2"> 2 </TabsTrigger>
    </TabsList>
    <TabsContent value="1"> 1 </TabsContent>
    <TabsContent value="2"> 2 </TabsContent>
  </Tabs>
</template>
```
::

## Examples

### Default

:ui-docs-tabs-default

### Variants

:ui-docs-tabs-variants

### Sizes

:ui-docs-tabs-sizes

### Disabled

:ui-docs-tabs-disabled

### Examples

:ui-docs-tabs-examples

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `modelvalue` | `string` | No | - | The controlled value of the tab to activate. Can be binded as `v-model` |
| `defaultValue` | `string` | No | - | The value of the tab that should be active when initially rendered. Use when you do not need to control the state of the tabs |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.\nIf omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string]` Event handler called when selected tab changes |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-orientation]` | "horizontal" \| "vertical" |

### List

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `loop` | `boolean` | No | true | When `loop` is `true`, keyboard navigation will loop from last tab to first, and vice versa |
| `size` | sm \| md \| lg | No | md | Size of the tabs list and tabs triggers |
| `variant` | tab \| pill | No | pill | Visual variant of the tabs list and tabs triggers |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-orientation]` | "horizontal" \| "vertical" |

### Trigger

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `value` | `string` | Yes | - | The unique value that associates the trigger with a content |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from selecting the tab |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "active" \| "inactive" |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | "horizontal" \| "vertical" |

### Content

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `value` | `string` | Yes | - | The unique value that associates the content with a trigger |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "active" \| "inactive" |
| `[data-orientation]` | "horizontal" \| "vertical" |

___

## Accessibility

Adheres to the [tabs wai-aria design pattern](https://www.w3.org/wai/aria/apg/patterns/tabpanel).

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content. |
| `ArrowDown` | Moves focus to the next trigger depending on orientation and activates its associated content. |
| `ArrowRight` | Moves focus to the next trigger depending on orientation and activates its associated content. |
| `ArrowUp` | Moves focus to the previous trigger depending on orientation and activates its associated content. |
| `ArrowLeft` | Moves focus to the previous trigger depending on orientation and activates its associated content. |
| `Home` | Moves focus to the first trigger and activates its associated content. |
| `End` | Moves focus to the last trigger and activates its associated content. |
