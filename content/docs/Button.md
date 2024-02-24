---
title: Button
description: The Button component is a fundamental UI element designed to trigger actions in web applications. This guide provides detailed insights into the customization options available, including variants, colors, sizes, and various states like disabled and loading. Utilize the provided examples to seamlessly integrate and adapt the Button component to meet your specific requirements.
---

# Button

The `Button` component serves as a fundamental UI element, specifically designed to trigger actions within web applications. This page provides an in-depth guide to the `Button` component, offering a rich set of settings for customization. Explore various options such as variants, colors, and sizes to effortlessly adapt the Button's appearance to suit your specific requirements.

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
| `as` | `AsTag` \| Component | No | button | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `variant` | filled \| outline \| ghost \| link | No | filled | Variant of a visual look of a button |
| `size` | xs \| sm \| md \| lg \| xl | No | md | Button size |
| `color` | [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | piccolo | Button color |
| `fullWidth` | `boolean` | No | - | If `true` button width will be 100% of its parent |
| `icon` | `string` | No | - | Iconify icon name |
| `iconPos` | left \| right | No | left | Icon will be placed on the **left** or **right** from children content
| `loading` | `boolean` | No | - | Activates loading spinner in place of the icon. Recommended only using with icon provided to prevent layout shifts |
| `animation` | error \| pulse | No | - | Set error or pulse animation |
| `type` | `ButtonHTMLAttributes["type"]` | No | - | HTML button type attribute |
