---
title: Dialog
description: A window overlaid on the primary window, rendering the content underneath inert.
---

# Dialog

`Dialog` is a window overlaid on the primary window, rendering the content underneath inert

___

## Anatomy

```vue
<template>
  <Dialog.Root>
    <!-- Use the Trigger to open the dialog -->
    <Dialog.Trigger />
    <!-- Or wrap your button within the Trigger with as-child prop -->
    <Dialog.Trigger as-child>
      <Button>Open</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Dialog title</Dialog.Title>
        <Dialog.Subtitle>Dialog subtitle</Dialog.Subtitle>
      </Dialog.Header>
      Dialog content
      <Dialog.Footer>
        <!-- The same for Close button -->
        <Dialog.Close as-child>
          <Button>Ok</Button>
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>
```
___

## Examples

### Default

:ui-docs-dialog-default

### Scrollable

:ui-docs-dialog-scrollable

## Notes

To activate the `Dialog` component from within a `ContextMenu` or `Dropdown`, you must wrap its root with the `Dialog.Root` component.

```vue
<template>
  <Dialog.Root>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger as-child>
        <Button>Open</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Dialog.Trigger as-child>
          <DropdownMenu.Item>
            <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </Dialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>

    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
      </Dialog.Header>
      You're about to delete something important!
      <Dialog.Footer>
        <Button>Confirm</Button>
        <Dialog.Close as-child>
          <Button>Cancel</Button>
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>
```

___

## API Reference

### Root

Refer to [Radix-Vue Dialog Root](https://www.radix-vue.com/components/dialog#root){:target="_blank"} API reference

### Trigger

Refer to [Radix-Vue Dialog Trigger](https://www.radix-vue.com/components/dialog#trigger){:target="_blank"} API reference

### Close

Refer to [Radix-Vue Dialog Close](https://www.radix-vue.com/components/dialog#close){:target="_blank"} API reference

### Content

Refer to [Radix-Vue Dialog Content](https://www.radix-vue.com/components/dialog#content){:target="_blank"} API reference

### Title

Refer to [Radix-Vue Dialog Title](https://www.radix-vue.com/components/dialog#title){:target="_blank"} API reference

### Subtitle

Refer to [Radix-Vue Dialog Description](https://www.radix-vue.com/components/dialog#description){:target="_blank"} API reference
