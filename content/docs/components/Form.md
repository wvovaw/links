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
  <form>
    <Form.Field v-slot="{ componentField, field, errorMessage }">
      <Form.Item>
        <Form.Label />
        <Form.Control>
          <!-- any Form (Input, Select, Radio etc.) component -->
          <Input v-bind="componentField" />
          <!-- Or native  -->
          <input v-bind="field">
        </Form.Control>
        <Form.Description />
        <Form.ErrorMessage>{{ errorMessage }}</Form.ErrorMessage>
      </Form.Item>
    </Form.Field>
  </form>
</template>
```

___

## Examples

### Default

This example shows the basic usage of Vee-Validate + Valibot with simple Input and Select components.

:ui-docs-form-default

### Sign Up Form Example

:ui-docs-form-register-form