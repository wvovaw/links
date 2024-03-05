---
title: Toggle
description: A UI component that lets users to choose one of two possible states like on or off.
---

# Toggle Documentation

A `Toggle` is a UI component that lets users switch between two states. It's a simple and effective way to give users a choice. This `Toggle` component supports different sizes, colors, states and can include icons.

## Examples

:ui-docs-toggle-default{title="Default"}

:ui-docs-toggle-variants{title="Variants"}

:ui-docs-toggle-sizes{title="Sizes"}

:ui-docs-toggle-stroke{title="Stroke"}

:ui-docs-toggle-icons{title="With icons"}

:ui-docs-toggle-colors{title="Colors"}

:ui-docs-toggle-disabled{title="Disabled"}

:ui-docs-toggle-v-model{title="v-model binding"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as ` | `AsTag` \| Component | No | button | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultValue ` | `boolean` | No | - | The pressed state of the toggle when it is initially rendered. Use when you do not need to control its open state |
| `pressed ` | `boolean` | No | - | The controlled pressed state of the toggle. Can be bind as `v-model` |
| `disabeld ` | `boolean` | No | - | When `true`, prevents user from interaction |
| `variant ` | default \| ghost | No | default | Variant of a visual look of a toggle |
| `size ` | sm \| md | No | md | Toggle size |
| `color ` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Toggle color |
| `icon ` | `string` | No | - | Iconify icon name |
| `iconPos ` | left \| right | No | left | Icon will be placed on the **left** or **right** from children content |
| `withStroke ` | `boolean` | No | - | If `true`, toggle will have stroke line when `hover:` and `data-state="on"` |

#### Emits

| Name | Payload |
|------|---------|
| `update:pressed` | `[value: boolean]` Event handler called when the pressed state of the toggle changes |

___

## Accessibility

#### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Space` | Toggles the state |
| `Enter` | Toggles the state |
