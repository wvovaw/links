---
title: Dropdown Menu
description: Dropdown menu displays a menu list of actions to the user after they trigger a button.
draft: true
---

# Dropdown Menu

`DropdownMenu` is a nested list of actions or options displayed to users after they trigger a button.

___

## Anatomy

```vue
<template>
  <DropdownMenu.Root>
    <!--
      <DropdownMenu.Trigger>
        open
      <DropdownMenu.Trigger>
    -->
    <!-- Or use `as-child` prop to merge the behavior to the Button component -->
    <DropdownMenu.Trigger as-child>
      <Button>Open</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label />
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.Item>
          <DropdownMenu.ItemIcon />
          <DropdownMenu.ItemTitle>Menu item</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemMeta>item meta</DropdownMenu.ItemMeta>
        </DropdownMenu.Item>
        <!-- Submenu -->
        <DropdownMenu.Sub>
          <!-- Don't forget as-child -->
          <DropdownMenu.SubTrigger as-child>
            <DropdownMenu.Item>Open submenu</DropdownMenu.Item>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Submenu item</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</template>
```
___

## Examples

### Default

:ui-docs-dropdown-menu-default

### Submenu

:ui-docs-dropdown-menu-submenu

### Radio Group

:ui-docs-dropdown-menu-radio

### Checkboxes

:ui-docs-dropdown-menu-checkbox

### Complex Example

:ui-docs-dropdown-menu-complex
