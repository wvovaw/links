---
title: InsertSelect
description: A UI component that displays a list of options for user to pick from.
---

# InsertSelect

The `InsertSelect` component is a styled variant of the native browser select element. It suports all available select attributes and expect `<option>` and `<optgroup>` as children content.

Learn more about [`option`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option) and [`optgroup`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/optgroup) elements.

## Examples

:ui-docs-insert-select-default{title="Default"}

:ui-docs-insert-select-label-hint{title="With hint messages"}

:ui-docs-insert-select-states{title="Different states"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `InputTypeHTMLAttribute` | No | - | HTML input type attributes excluding button, checkbox etc. |
| `modelValue` | `string \| number` | No | - | Model value binding. Can be bound with `v-model` |
| `label` | `string` | Yes | - | Label text |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `readonly` | `boolean` | No | - | When `true`, prevents user from input |
| `error` | `boolean` | No | - | When `true`, shows error state |
| `errorMessage` | `string` | No | - | Message that will be provided to `el.setCustomValidity(errorMessage)` browser API |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Input color |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the input when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string \| number]` Event handler called when the selected value changes |
