---
title: Group
description: A UI component visually coupling inputs, selects in one coupled group.
---

# Group

The `Group` component wraps all the children inputs within a single block, modifying theirs borders so they look like this. It helps to build compact forms or group context related inputs together.

___

## Anatomy

Group can accept `Input`, `InsertInput`, `Select`, `InsertSelect` and `RichSelect` components.

```vue
<template>
  <Group>
    <Input />
    <InsertInput />
    <Select />
    <InsertSelect />
    <RichSelect />
  </Group>
</template>
```

___

## Examples

### Default

:ui-docs-group-default

### Using Within A Form

:ui-docs-group-form-example

___

## API Reference

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `orientation` | vertical \| horizontal \| No | vertical | Defines how the group elements will be placed related to each other. |
