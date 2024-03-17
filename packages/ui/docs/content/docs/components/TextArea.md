---
title: Textarea
description: A UI component that allows users to input multiline text.
---

# TextArea

An `TextArea` is a UI component that allows users to input multiline text. Its behaviour is similar to [Input component](/docs/input). It can be bound with `v-model` for reactive data.

___

## Examples

### Default

:ui-docs-text-area-default

### Resize Property

:ui-docs-text-area-resize

### With Label and Hint

:ui-docs-text-area-label-hint

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `InputTypeHTMLAttribute` | No | - | HTML input type attributes excluding button, checkbox etc. |
| `modelValue` | `string \| number` | No | - | Model value binding. Can be bound with `v-model` |
| `placeholder` | `string` | No | - | Placeholder text |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `readonly` | `boolean` | No | - | When `true`, prevents user from input |
| `error` | `boolean` | No | - | When `true`, shows error state |
| `errorMessage` | `string` | No | - | Message that will be provided to `el.setCustomValidity(errorMessage)` browser API |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Textarea color |
| `resize` | horizontal \| vertical \| both \| none | No | both | Defines how user will be able to resize the textarea |
| `rows` | `number` | No | 2 | Amount of rows |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the input when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string \| number]` Event handler called when the input value changes |
