---
title: InsertInput
description: A UI component that allows users to enter various types of data - text, date and time, search etc.
---

# InsertInput

An `InsertInput` is a UI component that allows users to enter various types of data in a form or a search box. It can have different types, such as datetime, time, date, email, password, search, number, and text. It can also have different colors, states, and directions. It can be bound with `v-model` for reactive data.

___

## Examples

### Default

:ui-docs-insert-input-default

### Colors

:ui-docs-insert-input-colors

### With Hint Messages

:ui-docs-insert-input-hints

### Different States

:ui-docs-insert-input-states

### Input Types

:ui-docs-insert-input-text-input-types

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `InputTypeHTMLAttribute` | No | - | HTML input type attributes excluding button, checkbox etc. |
| `modelValue` | `string \| number` | No | - | Model value binding. Can be bound with `v-model` |
| `placeholder` | `string` | No | - | Placeholder text |
| `label` | `string` | Yes | - | Label text |
| `fullWidth` | `boolean` | No | - | If `true`, input width will be 100% of its parent |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `readonly` | `boolean` | No | - | When `true`, prevents user from input |
| `error` | `boolean` | No | - | When `true`, shows error state |
| `errorMessage` | `string` | No | - | Message that will be provided to `el.setCustomValidity(errorMessage)` browser API |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Input color |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the input when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string \| number]` Event handler called when the input value changes |
