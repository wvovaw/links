---
title: Select
description: A UI component that displays a list of options for user to pick from.
---

# Select

The `Select` component is a styled variant of the native browser select element. It suports all available select attributes and expect `<option>` and `<optgroup>` as children content.

Learn more about [`option`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/option) and [`optgroup`](https://developer.mozilla.org/ru/docs/Web/HTML/Element/optgroup) elements.

## Examples

:ui-docs-select-default{title="Default"}

:ui-docs-select-sizes{title="Sizes"}

:ui-docs-select-label-hint{title="With labels and hints"}

:ui-docs-select-optgroup{title="With option groups"}

:ui-docs-select-states{title="Different states"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modelValue` | `string \| number` | No | - | Model value binding. Can be bound with `v-model` |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `error` | `boolean` | No | - | When `true`, shows error state |
| `errorMessage` | `string` | No | - | Message that will be provided to `el.setCustomValidity(errorMessage)` browser API |
| `size` | sm \| md \| lg | No | md | Select size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Select color |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the select when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string \| number]` Event handler called when the select value changes |
