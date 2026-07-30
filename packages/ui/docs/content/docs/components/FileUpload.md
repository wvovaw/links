---
title: FileUpload
description: Headless file upload primitives and styled variants for button-based and drag-and-drop file selection.
---

# FileUpload

`FileUpload` provides headless primitives — `Root`, `Trigger`, `Dropzone`, `FileList`, and `Clear` — plus two ready-to-use styled variants: `UIFileUploadButton` and `UIFileUploadDropzone`.

All components support single and multiple file uploads, file type filtering, incremental selection, and `v-model` binding.

---

## Styled Variants

### Button

Button-style uploader with a trigger button and reset control.

:ui-docs-file-upload-button-variant

### Dropzone

Drag-and-drop zone with file list.

#### Single file with image type filter

:ui-docs-file-upload-default

#### Multiple files with incremental addition.

:ui-docs-file-upload-multiple

---

## Headless Primitives

For full control over the UI, compose the headless primitives directly.

### Anatomy

```vue
<UIFileUpload.Root v-model="files" multiple>
  <UIFileUpload.Trigger>Choose files</UIFileUpload.Trigger>

  <UIFileUpload.Dropzone v-slot="{ isOver }">
    {{ isOver ? 'Drop!' : 'Drag here' }}
  </UIFileUpload.Dropzone>

  <UIFileUpload.FileList v-slot="{ file, index, remove }">
    <div>
      {{ file.name }}
      <button @click="remove">×</button>
    </div>
  </UIFileUpload.FileList>

  <UIFileUpload.Clear>Clear</UIFileUpload.Clear>
</UIFileUpload.Root>
```

### Examples

#### Avatar Upload

Circular dropzone for a single image, implemented using headless upload. The preview fills the zone after selection.

:ui-docs-file-upload-avatar

---

## API Reference

### UIFileUploadButton / UIFileUploadDropzone

| Name         | Type                     | Required | Default            | Description                                     |
| ------------ | ------------------------ | -------- | ------------------ | ----------------------------------------------- |
| `modelValue` | `File \| File[] \| null` | No       | -                  | Model value binding                             |
| `accept`     | `string`                 | No       | -                  | Accepted file types                             |
| `multiple`   | `boolean`                | No       | `false`            | Enables multiple files and incremental addition |
| `label`      | `string`                 | No       | `"Upload File(s)"` | Trigger button text (button variant only)       |
| `resetLabel` | `string`                 | No       | `"Reset"`          | Reset button text (button variant only)         |

### Headless Primitives

#### UIFileUpload.Root

| Prop         | Type                     | Default | Description                    |
| ------------ | ------------------------ | ------- | ------------------------------ |
| `modelValue` | `File \| File[] \| null` | -       | v-model binding                |
| `multiple`   | `boolean`                | `false` | Enable multiple file selection |
| `accept`     | `string`                 | -       | Accepted file types            |

| Emit                | Payload                             |
| ------------------- | ----------------------------------- |
| `update:modelValue` | `[payload: File \| File[] \| null]` |
| `change`            | `[payload: File \| File[] \| null]` |

#### UIFileUpload.Trigger

Renders a `<button>` that opens the file picker on click.

| Slot      | Description    |
| --------- | -------------- |
| `default` | Button content |

#### UIFileUpload.Dropzone

Drag-and-drop target. Also opens file picker on click.

| Slot Prop | Type      | Description                                        |
| --------- | --------- | -------------------------------------------------- |
| `isOver`  | `boolean` | Whether a drag is currently hovering over the zone |

#### UIFileUpload.FileList

Renders each file via a scoped slot.

| Slot Prop  | Type         | Description                      |
| ---------- | ------------ | -------------------------------- |
| `file`     | `File`       | The current file                 |
| `index`    | `number`     | File index                       |
| `remove`   | `() => void` | Removes the current file         |
| `multiple` | `boolean`    | Whether multiple mode is enabled |

#### UIFileUpload.Clear

Renders a `<button>` that clears all files on click.

| Slot      | Description    |
| --------- | -------------- |
| `default` | Button content |
