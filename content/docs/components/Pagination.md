---
title: Pagination
description: Pagination component provides navigation between paginated data.
---

# Pagination

`Pagination` component provides navigation between paginated data.

___

## Anatomy

```vue
<template>
  <Pagination.Root>
    <Pagination.List v-slot="{ items }">
      <Pagination.First />
      <Pagination.Prev />
      <template v-for="(page, index) in items">
        <Pagination.ListItem v-if="page.type === 'page'" :key="index" />
        <Pagination.Ellipsis v-else :key="page.type" :index="index">
          &#8230;
        </Pagination.Ellipsis>
      </template>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination.List>
  </Pagination.Root>
</template>
```
___

## Examples

### Default

:ui-docs-pagination-default

### Simple

:ui-docs-pagination-simple

___

## API Reference

### Root

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | nav | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultPage` | `number` | No | 1 | The value of the page that should be active when initially rendered.<br>Use when you do not need to control the value state. |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `itemsPerPage` | `number` | No | 10 | Number of items per page. |
| `page` | `number` | No | - | The controlled value of the current page. Can be bound as `v-model:page`. |
| `showEdges` | `boolean` | No | false | When `true`, always shows first page, last page and ellipsis. |
| `siblingCount` | `number` | No | 2 | Number of sibling should be shown around the current page. |
| `total` | `number` | No | 0 | Number of items in your list. |

#### Emits

| Name | Payload |
|------|---------|
| `update:page` | `[value: number]` Event handler called when the page value changes. |

#### Slots

default

| Name | Payload |
|------|---------|
| `page` |  `number` Current page state |
| `pageCount` |  `number` Number of pages |

### List

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Slots

default

| Name | Payload |
|------|---------|
| `items` |  `{ type: 'elipsis' } \| { type: 'page'; value: number; }` Pages item |

### ListItem

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-selected]` | "true" \| "" |
| `[data-type]` | "page" |

### Elipsis

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-type]` | "elipsis" |

### First, Next, Last, Prev

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
