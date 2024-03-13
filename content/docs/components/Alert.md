---
title: Alert
description: A UI component displaying a callout for user attention.
---

# Alert

`Alert` is a UI component displaying a callout for user attention. This component is open for any kind of customization via `class` attribute.

___

## Anatomy

::ui-docs-code-block{filename="Alert.vue" lang="vue"}
```vue
<template>
  <Alert.Root>
    <Alert.Title />
    <Alert.Description />
    <Alert.Actions />
  </Alert.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-alert-default

### Customization

:ui-docs-alert-customization

___

## Accessibility

Adheres to the [WAI-ARIA Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/).
