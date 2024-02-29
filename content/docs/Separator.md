---
title: Separator
description: A UI component that semantically or visually separates content.
---

# Separator

The `Separator` component used to separate page content, menu items etc. It follows the WAI-ARIA separator role requirements.

## Examples

:ui-docs-separator-default{title="Default"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `orientation` | vertical \| horizontal | No | - | The orientation of the component, which determines how focus moves: **horizontal** for left/right arrows and **vertical** for up/down arrows |
| `decorative` | `boolean` | No | - | Whether or not the component is purely decorative. When `true`, accessibility-related attributes are updated so that the rendered element is removed from the accessibility tree. |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-orientation]` | "horizontal" \| "vertical" |
