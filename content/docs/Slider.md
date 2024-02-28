---
title: Slider
description: A UI component that allows user to select one ore more numbers from a given range.
---

# Slider

`Slider` is a component that gives the user the ability to select one or more values from a range of numbers.

## Examples

:ui-docs-slider-default{title="Default"}

<!-- :ui-docs-slider-variants{title="Variants"} -->

<!-- :ui-docs-slider-sizes{title="Sizes"} -->

<!-- :ui-docs-slider-colors{title="Colors"} -->

<!-- :ui-docs-slider-icons{title="Icons"} -->

<!-- :ui-docs-slider-clickable{title="Clickable icons"} -->

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultValue` | `number[]` | No | `[0]` | The value of the slider when initially rendered. Use when you don't need to control the state of the slider. |
| `inverted` | `boolean` | No | false | Whether the slider is visually inverted. |
| `max` | `number` | No | 100 | The maximum value of the range. |
| `min` | `number` | No | 0 | The minumum value of the range. |
| `minStepsBetweenThumbs` | `number` | No | 0 | The minimum permited steps between multiple thumbs. |
| `step` | `number` | No | 1 | The stepping interval. |
| `modelValue` | `number[]` | No | - | The controlled value of the slider. Can be bound with `v-model`. |
| `name` | `string` | No | - | The name of the slider. |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.<br>If omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |
| `size` | sm \| md \| lg | No | md | Size of a slider |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: number[]]` Event handler called when the slider value changes |
| `valueCommit` | `[payload: number[]]` Event handler called when the value changes at the end of an interaction.<br>Useful when you only need to capture a final value e.g. to update a backend service. |

___

## Accessibility

Adheres to the [Slider WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb).

### Keyboard Interactions

| Key | Description |
|-----|-------------|
| `ArrowRight` | Increments/decrements by the `step` value depending on `orientatio`. |
| `ArrowLeft` | Increments/decrements by the step `value` depending on orientation. |
| `ArrowUp` | Increases the value by the `step` amount. |
| `ArrowDown` | Decreases the value by the `step` amount. |
| `PageUp` | Increases the value by a larger `step`. |
| `PageDown` | Decreases the value by a larger `step`. |
| `Shift` + ArrowUp | Increases the value by a larger `step`. |
| `Shift` + ArrowDown | Decreases the value by a larger `step`. |
| `Home` | Sets the value to its minimum. |
| `End` | Sets the value to its maximum. |
