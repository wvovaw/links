---
title: Collapsible
description: A UI component that expands/collapses a panel.
---

# Collapsible

`Collapsible` is a UI component that is used to build collapsible panels which user can toggle between collapsed and expanded states.
The `Collapsible` component itself is a headless component. That means that you can build your own visual implemntation. Collapsible response only for collapsed/expanded state and css animation.

___

## Anatomy

::ui-docs-code-block{filename="Collapsible.vue" lang="vue"}
```vue
<template>
  <CollapsibleRoot>
    <CollapsibleToggle />
    <CollapsibleContent />
  </CollapsibleRoot>
</template>
```
::

___

## Examples

### Default

:ui-docs-collapsible-default

### Uncontrolled with scoped slot

:ui-docs-collapsible-uncontrolled

> It's not necessary to control the `open` state of the collapsible. You may lay on the default slot scoped `open` value instead.

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. div is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultOpen` | `boolean` | No | `false` | The open state of the collapsible when it is initially rendered. Use when you don't need to controll its open state. |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction. |
| `open` | `boolean` | No | - | The controlled open state of the collapsible. Can be bound with `v-model` |

#### Emits

| Name | Payload |
|------|---------|
| `update:open` | `[value: boolean]` Event handler called when the open state changes |

#### Slots

default

| Key | Value |
|-----|-------|
| `open` | `boolean` The open state |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" or "closed" |
| `[data-disabled]` | Present when disabled |

### Trigger

`CollapsibleTrigger` component API

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | `button` | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" or "closed" |
| `[data-disabled]` | Present when disabled |

### Content

`CollapsibleContent` component API

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | `button` | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `forceMount` | `boolean` | No | - | Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries. |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" or "closed" |
| `[data-disabled]` | Present when disabled |

___

## Accessibility

Adheres to the [disclosure wai-aria design pattern](https://www.w3.org/wai/aria/apg/patterns/disclosure).

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Enter` | Opens/closes the collapsible |
| `Space` | Opens/closes the collapsible |
