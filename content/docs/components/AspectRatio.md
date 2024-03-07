---
title: Aspect Ratio
description: Aspect ratio displays content within a defined ratio.
---

# AspectRatio

`AspectRatio` component displays content within a desired ratio.

___

## Examples

### 16/9

:ui-docs-aspect-ratio-sixteen-nineteen

### 1/1

:ui-docs-aspect-ratio-one-one

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `ratio` | `number` | No | - | The desired ratio. eg: 16/9 |

#### Slots

Default

| Name | Payload |
|------|---------|
| `aspect` |  `number` Current ratio in % |
