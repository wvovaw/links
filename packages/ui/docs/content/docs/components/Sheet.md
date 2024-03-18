---
title: Sheet
description: A dialog component, that complements the maint content of the screen.
---

# Sheet

`Sheet' is a dialog component that slides out from one edge of the screen when opened and slides in when closed. It is typically used to supplement the main content of the screen.

___

## Anatomy

::ui-docs-code-block{filename="Sheet.vue" lang="vue"}
```vue
<template>
  <Sheet.Root>
    <!-- Use the Trigger to open the dialog -->
    <Sheet.Trigger />
    <!-- Or wrap your button within the Trigger with as-child prop -->
    <Sheet.Trigger as-child>
      <Button>Open</Button>
    </Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Sheet title</Sheet.Title>
        <Sheet.Subtitle>Sheet subtitle</Sheet.Subtitle>
      </Sheet.Header>
      Sheet content
      <Sheet.Footer>
        <!-- The same for Close button -->
        <Sheet.Close as-child>
          <Button>Ok</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-sheet-default

### Side

:ui-docs-sheet-side

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
