---
title: Toast
description: A notification message that is displayed temporarily.
new: true
draft: true
---

# Toast

`Toast` component is a notification message that can be displayed on demand after some user action or error or whatever else.

___

## Anatomy

You can place the `<Toaster />` component in the entry of your app and then emit notifications using `useToast().toast({ ... })`

::ui-docs-code-block{filename="App.vue" lang="vue"}
```vue
<script setup>
import { UIToaster } from "@links/ui";
</script>

<template>
  <UIToaster />
</template>
```
::

::ui-docs-code-block{filename="~features/inbox/ui/remove-letter.vue" lang="vue"}
```vue
<script setup lang="ts">
import { h } from "vue";
import { UIButton, UIToast, useToast } from "@links/ui";

const { toast } = useToast();

function deleteLetter() {
  toast({
    title: "Letter has been deleted",
    content: "The letter has been successfully deleted",
    action: h(UIToast.Action, { altText: "Undo", onClick: () => alert("Can't undo this action :o") }, { default: () => "Undo" }),
  });
}
</script>

<template>
  <UIButton @click="deleteLetter">
    Delete the letter
  </UIButton>
</template>
```
::

Or you can write an action using TSX

::ui-docs-code-block{filename="~features/inbox/ui/remove-letter.vue" lang="vue"}
```vue
<script setup lang="tsx">
import { defineComponent } from "vue";
import { UIButton, UIToast, useToast } from "@links/ui";

const { toast } = useToast();

const UndoAction = defineComponent(() => {
  function handleAction() {
    alert("Can't undo this action :o");
  }
  // @ts-expect-error jsx click event is onClick, but ts think it is a prop of the component which is undefined
  return () => <UIToast.Action altText="Undo" onClick={handleAction}>Undo</UIToast.Action>;
});

function deleteLetter() {
  toast({
    title: "Letter has been deleted",
    content: "The letter has been successfully deleted",
    action: UndoAction
  });
}
</script>

<template>
  <UIButton @click="deleteLetter">
    Delete the letter
  </UIButton>
</template>
```
::

___

## Examples

### Default

:ui-docs-toast-default

### With Action

:ui-docs-toast-with-action

### Variants

:ui-docs-toast-variants

___

## API Reference

For building a Toaster component from primitives, instead of using provided `<Toaster />` and `useToast`, follow the  [Radix-Vue docs](https://www.radix-vue.com/components/toast#api-reference).

Here's the fast docummentation of the `<Toaster />`, `useToast`, `<Toast.Root /> and `<Toast.Action />` api's.

### Toaster

Wrapper component for the radix-vue `ToastProvider` and `ToastViewport`. Place it in the entry of the app, like `App.vue`.

### Root

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as ` | `AsTag` \| Component | No | `li` | Setting a root HTML element. li is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |
| `defaultOpen` | `boolean` | No | `true` | The open state of theh dialog when it is initially rendered. Use when you do not need to control its open state. |
| `duration` | `number` | No | 5000 | Time in ms that toast should remain visible for. Overrides the value given to `ToastProvider` |
| `forceMount| `boolean` | No | - | Used to force mount when move control is needed. Useful when controlling animation with vue animation libraries. |
| `open` | `boolean` | No | - | The controlled open state of the toast. Can be bound as `v-model:open`. |
| `type` | foreground \| background | No | foreground | Control the sensitivity of the toast for accessibility purposes. For toasts that are the result of a user action, use `foreground`. Toasts generated from background tasks should be `background`. |
| `variant ` | default \| success \| warning \| error | No | default | Variant of a visual look of a toast |

### Action

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `altText` | `string` | Yes | - | A short description for an alternate way to carry out the action. For screen reader users who will not be able to navigate to the button easily/quickly. |
| `as ` | `AsTag` \| Component | No | `div` | Setting a root HTML element. div is default |
| `asChild` | `boolean` | No | - | Change the root rendered element for the one passed as a child, merging their props and behavior. Read [Radix-Vue composition guide](https://www.radix-vue.com/guides/composition) for more details |

### useToast composible

The `useToast` declares a state with the next types

```ts
import type { Component, VNode } from "vue";

export type StringOrVNode =
  | string
  | VNode
  | (() => VNode);

interface ToasterToast extends ToastProps {
  id: string;
  title?: string;
  content?: StringOrVNode;
  action?: Component;
}
interface State {
  toasts: ToasterToast[];
}

const state = ref<State>({
  toasts: [],
});
```

It provides the state, factory function `toast` and `dismiss` function for dispatching `DISMISS_TOAST` action programatically for a particular toast by it's id, if needed.

```ts
function useToast() {
  return {
    toasts: computed(() => state.value.toasts),
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}
```

`toast` function itself incapsulates a toast inner data as `id` and provides methods `dismiss` to dismiss this toast, `update` to update some partial data (Root props) and dispatches `ADD_TOAST` action when called.
