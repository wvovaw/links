---
title: Menu
description: An menu component. Used in vertical menus in Popovers, Sidebars etc.
---

# Menu

`Menu` are used in such vertical menues and containers as Popovers, Sidebars, Drawers, Dialogs etc.

Menu item row heights can vary based on the amount of content in each row. The content in each row is flexible. By default, each menu item row height is Medium(md) 40px for one line of content.

___

## Anatomy

Default variant

::ui-docs-code-block{filename="Menu.vue" lang="vue"}
```vue
<template>
  <Menu.Item>
    <Menu.Icon />
    <Menu.Title />
    <Menu.Meta />
  </Menu.Item>
</template>
```
::

`Menu.Checkbox` allows displaying a checkbox within a menu

::ui-docs-code-block{filename="MenuWithCheckboxes.vue" lang="vue"}
```vue
<template>
  <Menu.Group type="multiple">
    <Menu.GroupItem>
      <Menu.Icon />
      <Menu.Title />
      <Menu.Checkbox />
    </Menu.GroupItem>
  </Menu.Group>
</template>
```
::

Radio group

`Menu.Group` and `Menu.Radio` allows creating a radio group within a menu

::ui-docs-code-block{filename="MenuWithRadio.vue" lang="vue"}
```vue
<template>
  <Menu.Group type="single">
    <Menu.GroupItem>
      <Menu.Icon />
      <Menu.Title />
      <Menu.Radio />
    </Menu.GroupItem>
  </Menu.Group>
</template>
```
::

___

## Examples

### Default

:ui-docs-menu-default

### Checkbox

:ui-docs-menu-checkbox

### Radio

:ui-docs-menu-radio

### Multiline

:ui-docs-menu-multiline

___

## API Reference

### Group

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | button | Sets the root HTML element. button is default |
| `asChild` | `boolean` | No | - | Changes the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `type` | single \| multiple | No | single | Determines whether a single or multiple items can be pressed at a time |
| `modelvalue` | `string \| string[]` | No | - | The controlled value of the pressed item. Can be bind as `v-model` |
| `defaultValue` | `string \| string[]` | No | - | The value of the item to show as pressed when initially rendered. Use when you do not need to control the state of the items |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |

#### Emits

| Name | Payload |
|------|---------|
| `update:modelValue` | `[payload: string]` Event handler called when the value changes |

#### Slots

default

| Name | Payload |
|------|---------|
| `modelValue` | `string \| string[] \| undefined` Current toggle values |

### GroupItem

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `AsTag` \| Component | No | div | Setting a root HTML element. button is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultValue ` | `boolean` | No | - | The pressed state of the toggle when it is initially rendered. Use when you do not need to control its open state |
| `value` | `string` | Yes | - | A string value for the menu group item. All items within a menu group should use a unique value. |
| `pressed ` | `boolean` | No | - | The controlled pressed state of the toggle. Can be bind as `v-model` |
| `disabeld` | `boolean` | No | - | When `true`, prevents user from interaction |
| `isActive` | `boolean` | No | - | Menu item active state |

#### Data Attributes

| Key | Value |
|------|---------|
| `[data-state]` | "on" \| "off" |
| `[data-disabled]` | Present when disabled |
| `[data-orientation]` | "vertical" \| "horizontal" |
| `[data-menuitem-active]` | `boolean` mirroring `isActive` prop |

### Icon

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `string` | Yes | - | Iconify icon string |

### Multiline

#### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Title string |
| `subtitle` | `string` | Yes | - | Subitle string |
