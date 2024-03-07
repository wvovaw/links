---
title: Radio Group
description: A UI component that allows users to select one option from a set of mutually exclusive choices.
---

# Radio Group

A `RadioGroup` is a UI component that allows users to select one option from a set of mutually exclusive choices. It consists of a group of radio items that can have different colors, sizes, and states. It can also be rendered as a different HTML element or a custom component.

___

## Anatomy

```vue
<RadioGroup>
  <RadioGroupItem />
</RadioGroup>
```

___

## Examples

### Default

:ui-docs-radio-group-default{title="Default"}

### Colors

:ui-docs-radio-group-colors{title="Colors"}

### Disabled

:ui-docs-radio-group-disabled{title="Disabled"}

___

## API Reference

### Group

`RadioGroup` component API

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `modelvalue` | `string` | No | - | The controlled value of the radio item to check. Can be binded as `v-model` |
| `defaultValue` | `string` | No | - | The value of the radio item that should be checked when initially rendered. Use when you do not need to control the state of the radio items |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `name` | `string` | No | - | The name of the radio group. Submitted with its owning form as part of a name/value pair |
| `required` | `boolean` | No | - | When `true`, indicates that the user must check a radio before the owning form can be submited |
| `loop` | `boolean` | No | true | When `loop` and `rovingFocus` is `true`, keyboard navigation will loop from last item to first, and vice versa |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.\nIf omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Radio items color |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string]` Event handler called when the radio group value changes |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-disabled]` | Present when disabled |

### Item

`RadioGroupItem` component API

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `value` | `string` | No | - | The value given as data value when submitted with a `name` |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `required` | `boolean` | No | - | When `true`, indicates that the user must check a the radio item before the owning form can be submited |
| `name` | `string` | No | - | The name of the radio item |
| `id` | `string` | No | - | The id of the radio item (Used to label with `for` attribute) |
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Radio item color |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "checked" \| "undhecked" |
| `[data-disabled]` | Present when disabled |

___

## Accessibility

Adheres to the [radio group wai-aria design pattern](https://www.w3.org/wai/aria/apg/patterns/radiobutton) and uses [roving tabindex](https://www.w3.org/TR/wai-aria-practices-1.2/examples/radio/radio.html) to manage focus movement among radio items.

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `Tab` | Moves focus to to either the checked radio item or the first radio item in the group |
| `Space` | When focus is on an unchecked radio item, checks it |
| `ArrowDown` | Moves focus to the next radio item in the group |
| `ArrowRight` | Moves focus to the next radio item in the group |
| `ArrowUp` | Moves focus to the previous radio item in the group |
| `ArrowLeft` | Moves focus to the previous radio item in the group |
