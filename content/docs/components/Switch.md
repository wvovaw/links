---
title: Switch
description: A UI component that allows users to switch between two options like on and off.
---

# Switch

The `Switch` component is a highly versatile and essential element in user interface design. It allows users to toggle between two states, such as on and off, enabling a more interactive user experience. With customizable sizes, colors, and the ability to be used within forms, the `Switch` component is designed for flexibility and ease of use. Its adherence to the roving tabindex accessibility standard ensures it is accessible to all users.

## Examples

:ui-docs-switch-default{title="Default"}

:ui-docs-switch-sizes{title="Sizes"}

:ui-docs-switch-colors{title="Colors"}

:ui-docs-switch-form-example{title="Using in form"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `checked` | `boolean` | No | false | The controlled state of the Switch. Can be bind as `v-model:checked` |
| `defaultChecked` | `boolean` | No | - | The state of the switch when it is initially rendered. Use when you do not need to control its state |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `name` | `string` | No | - | The name of the Switch. Submitted with its owning form as part of a name/value pair |
| `value` | `string` | No | "on" | The value given as data when submited with a `name` |
| `required` | `boolean` | No | - | When `true`, indicates that the user must check the switch before the owning form can be submited |
| `size` | xs \| sm \| md | No | md | Switch items size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Switch items color |
| `class` | `string` | No | - | Unocss utility classes merged into the root of thw Switch |

#### Emits

| Name | Payload |
|------|---------|
| `update:checked` | `[payload: boolean]` Event handler called when the checked state changes |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "checked" \| "unchecked" |
| `[data-disabled]` | Present when disabled |

___

## Accessibility

Adheres to the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/patterns/switch).

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Space` | Toggles the `checked` state |
| `Enter` | Toggles the `checked` state |
