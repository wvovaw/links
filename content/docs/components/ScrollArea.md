---
title: Scroll Area
description: Agments native scroll functionality for custom, cross-browser styling.
---

# Scroll Area

Use `ScrollArea` when you need some widget with scroll. Scrollbars in `ScrollArea` are on top of the content and take no space.

## Examples

:ui-docs-scroll-area-default{title="Default"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `type` | always \| hover \| auto \| scroll | No | hover | Describes the nature of scrollbar visibility:<br>`auto` - scrollbars are visible when content is overflowing on the corresponding orientation.<br>`always` - scrollbars are always visible<br>`scroll` - scrolbars are visible when the user is scrolling alog corresponding orientation.<br>`hover` - same as `scroll` but also if user is hovering over the scroll area. |
| `scrollHideDelay` | `number` | No | 600 | If type is set to either `scroll` of `hover`, this prop determines the length of time, in ms, before the scrollbars are hidden after the user stops interacting with scrollbars. |
