---
title: Dropdown Menu
description: Dropdown menu displays a menu list of actions to the user after they trigger a button.
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

___

## API Reference

### Root

Refer to [Radix-Vue DropdownMenu Root](https://www.radix-vue.com/components/dropdown-menu#root){:target="_blank"} API reference

### Trigger

Refer to [Radix-Vue DropdownMenu Trigger](https://www.radix-vue.com/components/dropdown-menu#trigger){:target="_blank"} API reference

### Group

Refer to [Radix-Vue DropdownMenu Group](https://www.radix-vue.com/components/dropdown-menu#group){:target="_blank"} API reference

### Content

Refer to [Radix-Vue DropdownMenu Content](https://www.radix-vue.com/components/dropdown-menu#content){:target="_blank"} API reference

### Item

Refer to [Radix-Vue DropdownMenu Item](https://www.radix-vue.com/components/dropdown-menu#item){:target="_blank"} API reference

### Item Icon

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `string` | Yes | - | Iconify icon name string |

### Radio Group

Refer to [Radix-Vue DropdownMenu Radio Group](https://www.radix-vue.com/components/dropdown-menu#radiogroup){:target="_blank"} API reference

### Radio Item

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Radio items color |

Refer to [Radix-Vue DropdownMenu Radio Item](https://www.radix-vue.com/components/dropdown-menu#radioitem){:target="_blank"} API reference

### Checkbox Item

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No | default | Radio items color |
| `size ` | sm \| md | No | md | Checkbox size |

Refer to [Radix-Vue DropdownMenu Checkbox Item](https://www.radix-vue.com/components/dropdown-menu#checkboxitem){:target="_blank"} API reference

### Sub

Refer to [Radix-Vue DropdownMenu Sub](https://www.radix-vue.com/components/dropdown-menu#sub){:target="_blank"} API reference

### Sub Trigger

Refer to [Radix-Vue DropdownMenu Sub Trigger](https://www.radix-vue.com/components/dropdown-menu#subtrigger){:target="_blank"} API reference

### Sub Content

Refer to [Radix-Vue DropdownMenu Sub Content](https://www.radix-vue.com/components/dropdown-menu#subcontent){:target="_blank"} API reference
