---
title: Button
description: A UI component that allows users to perform an action or submit a form.
---

# Button

A `Button` is a UI element that allows users to perform a click or tap action. This `Button` component offers various styles, sizes, and states to fit different use cases. It can display as a default button, a link, or even with animations. It also supports full width, disabled state, and loading state.

## Examples

Explore the following examples to understand different use cases and visual styles:

:ui-docs-button-default{title="Default"}

:ui-docs-button-as-link{title="As anchor link"}

:ui-docs-button-variants{title="Variants"}

> Notice that buttons have "focus" state styling. Click on a field and tab through them

:ui-docs-button-colors{title="Colors"}

:ui-docs-button-sizes{title="Sizes"}

:ui-docs-button-full-width{title="Full width"}

:ui-docs-button-icons-only{title="Icons only"}

:ui-docs-button-disabled{title="Disabled"}

:ui-docs-button-animation{title="Animation"}

:ui-docs-button-loading{title="Loading"}

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabled` | `boolean` | No | - | When `true`, prevents user from interaction |
| `variant` | filled \| outline \| ghost \| link | No | filled | Variant of the visual look of the button |
| `size` | xs \| sm \| md \| lg \| xl | No | md | Button size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Button color |
| `fullWidth` | `boolean` | No | - | If `true`, button width will be 100% of its parent |
| `icon` | `string` | No | - | Iconify icon name |
| `iconPos` | left \| right | No | left | Icon will be placed on the **left** or **right** from children content
| `loading` | `boolean` | No | - | Activates loading spinner in place of the icon. Recommended only using with icon provided to prevent layout shifts |
| `animation` | error \| pulse | No | - | Sets error or pulse animation |
| `type` | `ButtonHTMLAttributes["type"]` | No | - | HTML button type attribute |
