---
title: Tags Input
description: A UI input component which captures input results and display them as tags inside of the input.
---

# Tags Input

`TagsInput` is an extension of the text `Input` component. This component allows users to both enter text and capture input results and display them as well.
These selected text entries are being displayed as `Tag`s. Tags represent a set of interactive keywords that help organize and categorize objects.
Tags can be added by pressing the Enter key or removed by Backspace key or the mouse click from the input element.

## Examples

:ui-docs-tags-input-default{title="Default"}

:ui-docs-tags-input-sizes{title="Sizes"}

___

## API Reference

### TagsInputRoot

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultValue` | `string[]` | No | - | The value of the tags that should be added. Use when you don't need to controll the state of the tags input. |
| `delimeter` | `string` | No | "," | The character to trigger the addition of a new tag. Also used to split tags for `@paste` event. |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the input when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `duplicate` | `boolean` | No | - | When `true`, allow duplicated tags. |
| `max` | `number` | No | 0 | Maximum number of tags. |
| `modelValue` | `string[]` | No | - | The list of inputed strings. Can be bound with `v-model` |
| `name` | `string` | No | - | The name of the tags input submitted with its owning form as part of a name/value pair. |
| `required` | `boolean` | No | - | When `true`, indicates that the user must add the tags input before the owning form can be submited. |
| `size` | sm \| md \| lg | No | md | TagsInput size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Input color |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string[]]` Event handler called when the value changes |
| `invalid` | `[payload: string]` Event handler called when the value is invalid |

#### Slots

default

| Name | Payload |
|------|---------|
| `modelValue` | `string[]` Currentt input values |

#### Data attributes

| Key | Value |
|------|---------|
| `[data-disabled]` | Present when disabled |
| `[data-focused]` | Present when focus on input |
| `[data-invalid]` | Present when input value is invalid |

### TagsInputItem

The component representing one Tag item

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `value` | `string` | Yes | - | Value associated with the tags. |
| `variant` | fill \| outline | No | fill | Visual variant of a tag |
| `size` | xs \| sm | No | sm | Size of a tag |
| `iconLeft` | `string` | No | - | Left icon (iconify icon name) |
| `color` | [default]{style="color: var(--bulma)"} \| [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Tag color |

#### Data attributes

| Key | Value |
|------|---------|
| `[data-state]` | "active" \| "inactive" |
| `[data-disabled]` | Present when disabled |

### TagsInputInput

The input field inside of TagsInput component

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `value` | `string` | Yes | - | Value associated with the tags. |
| `placeholder` | `string` | No | - | Placeholder text |
| `autoFocus` | `boolean` | No | - | Focus element when mounted |
| `maxLength` | `number` | No | - | Maximum number of character allowed |

#### Data attributes

| Key | Value |
|------|---------|
| `[data-invalid]` | Present when input value is invalid |

___

## Accessibility

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Delete` | When tag is active, remove it and set the tag on right active. |
| `Backspace` | When tag is active, remove it and set the tag on left active. If there are no tags to the left, either the next tags gets focus, or the input. |
| `ArrowRight` | Set the next tag active. |
| `ArrowLeft` | Set the previous tag active. |
| `Home` | Set the first tag active |
| `End` | Set the last tag active |
