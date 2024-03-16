---
title: Tag
description: A compact UI element that usually used to represent attributes of an object.
---

# Tag

`Tag` component is a small UI element that can be used in many different scenarious. Usually it used to represent some kind of list of active attributes of an object in some context. It also can accept user actions via `icon-left-click` and `icon-right-click`.

___

## Examples

### Default

:ui-docs-tag-default

### Variants

:ui-docs-tag-variants

### Sizes

:ui-docs-tag-sizes

### Colors

:ui-docs-tag-colors

### Icons

:ui-docs-tag-icons

### Clickable Icons

:ui-docs-tag-clickable

> If `icon-left-click` event handler provided, then the left icon rendered as `button` (`span` otherwise). The same for the right icon.

### Customization

:ui-docs-tag-customization

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | fill \| outline | No | fill | Visual variant of a tag |
| `size` | xs \| sm | No | sm | Size of a tag |
| `iconLeft` | `string` | No | - | Left icon (iconify icon name) |
| `rightLeft` | `string` | No | - | Right icon (iconify icon name) |
| `color` | [default]{style="color: var(--bulma)"} \| [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Tag color |

#### Emits

| Name | Payload |
|------|---------|
| `icon-left-click` | Event handler called when the left icon clicked |
| `icon-right-click` | Event handler called when the right icon clicked |
