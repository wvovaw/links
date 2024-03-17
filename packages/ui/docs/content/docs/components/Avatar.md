---
title: Avatar
description: Avatar is an image element with a fallback for representing a user.
---

# Avatar

`Avatar` is an image element with a fallback for representing a user.

___

## Anatomy

::ui-docs-code-block{filename="Avatar.vue" lang="vue"}
```vue
<template>
  <Avatar.Root>
    <Avatar.Image />
    <Avatar.Fallback />
    <Avatar.Indicator />
  </Avatar.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-avatar-default

### Sizes

:ui-docs-avatar-sizes

### Indicator

:ui-docs-avatar-indicator

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `size` | xs \| sm \| md \| lg \| xl \| 2xl | No | md | Size property of the avatar. |
| `shape` | circle \| square | No | square | Square with rounded borders or fully rounded avatar variants. |

### Image

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `src` | `string` | Yes | - | An image source URL. |

#### Emits

| Name | Payload |
|------|---------|
| `loadingStatusChange` | `[value: ImageLoadingStatus]` A callback providing information about the loading status of the image.<br>This is useful in case you want to control more precisely what to render as the image is loading. |

### Fallback

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `delayMs` | `number` | No | 0 | Useful for delaying rendering so it only appears for those with slower connections. |

### Indicator

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `vertical` | top \| bottom | No | bottom | Vertical position of the indicator. |
| `horizontal` | start \| end | No | end | Horizontal position of the indicator. |
| `color` | [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | roshi | Indicator color. |
| `ping` | `boolean` | No | - | When `true` ping animation will be active. |
