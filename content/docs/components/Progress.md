---
title: Progress
description: A UI progress component.
---

# Progress

A `Progress` component is a visual representation of a progress.

## Examples

:ui-docs-progress-default{title="Default"}

:ui-docs-progress-sizes{title="Sizes"}

:ui-docs-progress-colors{title="Colors"}

:ui-docs-progress-indeterminate{title="Indeterminate"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `modelValue` | `string \| number` | No | - | Model value binding. Can be bound with `v-model` |
| `max` | `number` | No | DEFAULT_MAX | The maximum progress value. |
| `getValueLabel` | `(val: number, max: number) => string` | No | `${Math.round((value / max) * DEFAULT_MAX)}%` | A function to get the accessible label text representing the current value in a human-readable format.<br> If not provided, the value label will be read as the numeric value as a percentage of the max value. |
| `size` | xs \| sm \| md \| lg \| xl | No | md | Input size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} | No | piccolo | Input color |
<!-- | `dir` | ltr \| rtl | No | ltr | The reading direction of the input when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode | -->

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[value: number]` Event handler called when the progress value changes |
| `update:max` | `[value: string[]]` Event handler called when the max value changes |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "complete" \| "indeterminate" \| "loading" |
| `[data-value]` | The current progress value |
| `[data-max]` | The max value |
