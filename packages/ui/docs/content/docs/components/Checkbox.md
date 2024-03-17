---
title: Checkbox
description: A UI component that allows users to select one or more options from a set.
---

# Checkbox

A `Checkbox` is a user interface component that provides users with a way to select one or more options from a set. It's a simple and effective way to give users choices. This `Checkbox` component supports different sizes, colors, and states, including an indeterminate state. It can also be disabled if needed.

___

## Examples

### Default

:ui-docs-checkbox-default

### Sizes

:ui-docs-checkbox-sizes

### Colors

:ui-docs-checkbox-colors

### Indeterminate

:ui-docs-checkbox-indeterminate

### Disabled

:ui-docs-checkbox-disabled

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as ` | `AsTag` \| Component | No | button | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultChecked ` | `boolean` | No | - | The checked state of the checkbox when it is initially rendered. Use when you do not need to control its open state |
| `checked` | `boolean` \| "indeterminate" | No | - | The controlled checked state of the checkbox. Can be bound with `v-model` |
| `value` | `string` | No | "on" | The value given as data when submitted with a `name` |
| `disabeld ` | `boolean` | No | - | When `true`, prevents user from interaction |
| `required` | `boolean` | No | - | When `true`, indicates that the user must check the checkbox before the owning form can be submited |
| `id` | `string` | No | - | The id of the radio item (Used to label with `for` attribute) |
| `size ` | sm \| md | No | md | Checkbox size |
| `color ` | [default]{style="color: var(--bulma)"} \| [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Checkbox color |

#### Emits

| Name | Payload |
|------|---------|
| `update:checked` | `[value: boolean]` Event handler called when the checked state of the Checkbox changes |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "checked" \| "unchecked" \| "indeterminate" |
| `[data-disabled]` | Present when disabled |

___

## Accessibility

#### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Space` | Toggle the state of checkbox |
