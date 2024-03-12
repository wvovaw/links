---
title: Form
description: Building forms with VeeValidate and Valibot.
draft: true
---

# Form

`Form` is a wrapper of the Vee-Validate library.

___

## Anatomy

```vue
<template>
  <Form.Root>
    <Form.Field v-slot="{ ... }">
      <Form.Item>
        <Form.Label />
        <Form.Control>
          <!-- any Form Input component or native input elements -->
        </Form.Control>
        <Form.Description />
        <Form.ErrorMessage />
      </Form.Item>
    </Form.Field>
  </Form.Root>
</template>
```

___

## Examples

### Default

This example shows the basic usage of Vee-Validate + Valibot with simple Input and Select components.

:ui-docs-form-default
