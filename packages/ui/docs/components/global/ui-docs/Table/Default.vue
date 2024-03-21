<script setup lang="ts">
import PreviewFrame from "../PreviewFrame.vue";
import { UITable as Table } from "~ui/Table";
</script>

<template>
  <PreviewFrame variant="outline">
    <Table.Root>
      <Table.Caption>Some caption text</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Col 1</Table.Head>
          <Table.Head>Col 2</Table.Head>
          <Table.Head>Col 3</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Data 1</Table.Cell>
          <Table.Cell>Data 2</Table.Cell>
          <Table.Cell>Data 3</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Footer 1</Table.Cell>
          <Table.Cell>Footer 2</Table.Cell>
          <Table.Cell>Footer 3</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>
  </PreviewFrame>
</template>
