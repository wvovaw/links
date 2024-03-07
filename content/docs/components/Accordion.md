---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
---

# Accordion

`Accordion` component is a stacked set of interactive headings that each reveal a section of content.

___

## Anatomy

```vue
<template>
  <Accordion.Root>
    <Accordion.Item value="1">
      <Accordion.Trigger />
      <Accordion.Content />
    </Accordion.Item>
  </Accordion.Root>
</template>
```
___

## Examples

### Default

:ui-docs-accordion-default

### Sizes

:ui-docs-accordion-sizes

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `collapsible` | `boolean` | No | true | When type is "single", allows closing content when clicking trigger for an open item. When type is "multiple", this prop has no effect. |
| `defaultValue` | `string \| string[]` | No | - | The default active value of the item(s).<br>Use when you do not need to control the state of the item(s). |
| `dir` | ltr \| rtl | No | ltr | The reading direction of the combobox when applicable.\nIf omitted, inherits globally from `DirectionProvider` or assumes LTR (left-to-right) reading mode |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `modelvalue` | `string \| string[]` | No | - | The controlled value of the opened item. Can be bound with `v-model` |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |
| `type` | "single" \| "multiple" | No | single | Determines whether a "single" or "multiple" items can be pressed at a time.<br>This prop will be ignored if any of v-model or defaultValue is an defined, as the type will be inferred from the value.

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[value: string \| string[]]` Event handler called when the expanded state of an item changes |

#### Slots

Default

| Name | Payload |
|------|---------|
| `modelValue` |  `string \| string[] \| undefined` Current active value |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-orientation]` | "vertical" \| "horizontal" |

### Item

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `value` | `string` | Yes | - | A string value for the accordion item. All items within an accordion must use unique values. |

#### Slots

Default

| Name | Payload |
|------|---------|
| `open` |  `boolean` Current open value |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-disabled]` | Present if disabled |
| `[data-orientation]` | "vertical" \| "horizontal" |

### Trigger

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-disabled]` | Present if disabled |
| `[data-orientation]` | "vertical" \| "horizontal" |

### Content

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "open" \| "closed" |
| `[data-disabled]` | Present if disabled |
| `[data-orientation]` | "vertical" \| "horizontal" |

___

## Accessibility

Adheres to the [Accordion WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion).

### Keyboard Interactions

| Key | Value |
|------|---------|
| `Space` | When focus is on an `AccordionTrigger` of a collapsed section, expands the section.
| `Enter` | When focus is on an `AccordionTrigger` of a collapsed section, expands the section.
| `Tab` | Moves focus to the next focusable element.
| `Shift + Tab` | Moves focus to the previous focusable element.
| `ArrowDown` | Moves focus to the next `AccordionTrigger` when `orientation` is vertical.
| `ArrowUp` | Moves focus to the previous `AccordionTrigger` when `orientation` is vertical.
| `ArrowRight` | Moves focus to the next `AccordionTrigger` when `orientation` is horizontal.
| `ArrowLeft` | Moves focus to the previous `AccordionTrigger` when `orientation` is horizontal.
| `Home` | When focus is on an `AccordionTrigger`, moves focus to the start `AccordionTrigger`.
| `End` | When focus is on an `AccordionTrigger`, moves focus to the last `AccordionTrigger`.
