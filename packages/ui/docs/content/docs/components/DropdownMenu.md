---
title: Dropdown Menu
description: Dropdown menu displays a menu list of actions to the user after they trigger a button.
---

# Dropdown Menu

`DropdownMenu` is a nested list of actions or options displayed to users after they trigger a button.

---

## Anatomy

::ui-docs-code-block{filename="DropdownMenu.vue" lang="vue"}

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

::

---

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

---

## API Reference

### Root

Refer to [Reka UI DropdownMenu Root](https://reka-ui.com/docs/components/dropdown-menu#root){:target="\_blank"} API reference

### Trigger

Refer to [Reka UI DropdownMenu Trigger](https://reka-ui.com/docs/components/dropdown-menu#trigger){:target="\_blank"} API reference

### Group

Refer to [Reka UI DropdownMenu Group](https://reka-ui.com/docs/components/dropdown-menu#group){:target="\_blank"} API reference

### Content

Refer to [Reka UI DropdownMenu Content](https://reka-ui.com/docs/components/dropdown-menu#content){:target="\_blank"} API reference

### Item

Refer to [Reka UI DropdownMenu Item](https://reka-ui.com/docs/components/dropdown-menu#item){:target="\_blank"} API reference

### Item Icon

#### Props

| Name   | Type     | Required | Default | Description              |
| ------ | -------- | -------- | ------- | ------------------------ |
| `icon` | `string` | Yes      | -       | Iconify icon name string |

### Radio Group

Refer to [Reka UI DropdownMenu Radio Group](https://reka-ui.com/docs/components/dropdown-menu#radiogroup){:target="\_blank"} API reference

### Radio Item

#### Props

| Name    | Type                                                                                                                                                                                                                                              | Required | Default | Description       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | ----------------- |
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No       | default | Radio items color |

Refer to [Reka UI DropdownMenu Radio Item](https://reka-ui.com/docs/components/dropdown-menu#radioitem){:target="\_blank"} API reference

### Checkbox Item

#### Props

| Name    | Type                                                                                                                                                                                                                                              | Required | Default | Description       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | ----------------- |
| `color` | [default]{stule="color: var(--bulma)"} [piccolo]{style="color: var(--piccolo)"} \| [hit]{style="color: var(--hit)"} \| [roshi]{style="color: var(--roshi)"} \| [krillin]{style="color: var(--krillin)"} \| [chichi]{style="color: var(--chichi)"} | No       | default | Radio items color |
| `size ` | sm \| md                                                                                                                                                                                                                                          | No       | md      | Checkbox size     |

Refer to [Reka UI DropdownMenu Checkbox Item](https://reka-ui.com/docs/components/dropdown-menu#checkboxitem){:target="\_blank"} API reference

### Sub

Refer to [Reka UI DropdownMenu Sub](https://reka-ui.com/docs/components/dropdown-menu#sub){:target="\_blank"} API reference

### Sub Trigger

Refer to [Reka UI DropdownMenu Sub Trigger](https://reka-ui.com/docs/components/dropdown-menu#subtrigger){:target="\_blank"} API reference

### Sub Content

Refer to [Reka UI DropdownMenu Sub Content](https://reka-ui.com/docs/components/dropdown-menu#subcontent){:target="\_blank"} API reference
