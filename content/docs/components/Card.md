---
title: Card
description: A UI card component is an independent content item with its header, body and footer.
draft: true
---

# Card

`Card` is a composible UI element displaying a card with header, body and footer.

Card component and its items is fully customizable via `class` html attribute. It has no any special props or event emiters.

___

## Anatomy

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
___

## Examples

### Default

:ui-docs-card-default
