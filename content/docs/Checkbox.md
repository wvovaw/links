---
title: Checkbox
description:
---

# Checkbox

## Examples

:ui-docs-checkbox-default{title="Default"}

:ui-docs-checkbox-sizes{title="Sizes"}

:ui-docs-checkbox-colors{title="Colors"}

:ui-docs-checkbox-indeterminate{title="Indeterminate"}

:ui-docs-checkbox-disabled{title="Disabled"}

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
