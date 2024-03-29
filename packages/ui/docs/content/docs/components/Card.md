---
title: Card
description: A UI card component is an independent content item with its header, body and footer.
---

# Card

`Card` is a composable UI element displaying a card with header, body and footer.

Card component and its items is fully customizable via `class` html attribute. It has no any special props or event emiters.

___

## Anatomy

::ui-docs-code-block{filename="Card.vue" lang="vue"}
```vue
<template>
  <Card.Root>
    <Card.Header>
      <Card.Title>Title text</Card.Title>
      <Card.Subtitle>Subtitle text</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      Content...
    </Card.Body>
    <Card.Footer>
      Footer content...
    </Card.Footer>
  </Card.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-card-default
