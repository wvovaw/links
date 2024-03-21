---
title: Table
description: A UI component displaying data in a table format.
draft: true
---

# Table

`Table` is an HTML table element wrapper component.

This component can be integrated with [`@tanstack/vue-table`](https://tanstack.com/table/latest/docs/framework/vue/vue-table) library for building rich tables.

___

## Anatomy

::ui-docs-code-block{filename="Table.vue" lang="vue"}
```vue
<template>
  <Table.Root>
    <Table.Caption>Some caption text</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head>Col 1</Table.Head>
        <Table.Head>Col 2</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>Data 1</Table.Cell>
        <Table.Cell>Data 2</Table.Cell>
      </Table.Row>
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.Cell>Footer 1</Table.Cell>
        <Table.Cell>Footer 2</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-table-default
