---
title: Drawer
description: A Drawer component is a mobile friendly Modal dialog.
---

# Drawer

`Drawer` is a touch friendly dialog component. It's widely used in mobile apps. It supports a slide gesture to dismiss the dialog.

___

## Anatomy

::ui-docs-code-block{filename="Drawer.vue" lang="vue"}
```vue
<template>
  <Drawer.Root>
    <!-- Use the Trigger to open the dialog -->
    <Drawer.Trigger />
    <!-- Or wrap your button within the Trigger with as-child prop -->
    <Drawer.Trigger as-child>
      <Button>Open</Button>
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Drawer title</Drawer.Title>
        <Drawer.Subtitle>Drawer subtitle</Drawer.Subtitle>
      </Drawer.Header>
      Drawer content
      <Drawer.Footer>
        <!-- The same for Close button -->
        <Drawer.Close as-child>
          <Button>Ok</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
</template>
```
::

___

## Examples

### Default

:ui-docs-drawer-default

## Adaptive

You can combine `Drawer` and `Dialog` components together to create a dialog responsive. Here's a handy example with helpfull Vueuse composables.

:ui-docs-drawer-adaptive
