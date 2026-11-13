---
title: Dialog
description: A window overlaid on the primary window, rendering the content underneath inert.
---

# Dialog

`Dialog` is a window overlaid on the primary window, rendering the content underneath inert

---

## Anatomy

::ui-docs-code-block{filename="Dialog.vue" lang="vue"}

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

::

---

## Examples

### Default

:ui-docs-dialog-default

### Scrollable

:ui-docs-dialog-scrollable

## Notes

To activate the `Dialog` component from within a `ContextMenu` or `Dropdown`, you must wrap its root with the `Dialog.Root` component.

::ui-docs-code-block{filename="DialogFromDropdown.vue" lang="vue"}

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

::

---

## API Reference

### Root

Refer to [Reka UI Dialog Root](https://reka-ui.com/docs/components/dialog#root){:target="\_blank"} API reference

### Trigger

Refer to [Reka UI Dialog Trigger](https://reka-ui.com/docs/components/dialog#trigger){:target="\_blank"} API reference

### Close

Refer to [Reka UI Dialog Close](https://reka-ui.com/docs/components/dialog#close){:target="\_blank"} API reference

### Content

Refer to [Reka UI Dialog Content](https://reka-ui.com/docs/components/dialog#content){:target="\_blank"} API reference

### Title

Refer to [Reka UI Dialog Title](https://reka-ui.com/docs/components/dialog#title){:target="\_blank"} API reference

### Subtitle

Refer to [Reka UI Dialog Description](https://reka-ui.com/docs/components/dialog#description){:target="\_blank"} API reference
