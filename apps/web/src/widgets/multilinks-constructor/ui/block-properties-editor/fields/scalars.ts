import type { BlockItemField } from "@links/blocks";
import type { Component } from "vue";

import BooleanField from "./boolean-field.vue";
import ColorField from "./color-field.vue";
import DateField from "./date-field.vue";
import ImageField from "./image-field.vue";
import NumberField from "./number-field.vue";
import SelectField from "./select-field.vue";
import TextField from "./text-field.vue";
import UrlField from "./url-field.vue";

/**
 * The fields a list row can render. This lives apart from `./index` because `list-field.vue` renders
 * its rows through it: importing `./index` there would close the cycle
 * `index.ts → list-field.vue → index.ts`.
 */
export const scalarFields: Record<BlockItemField["type"], Component> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  url: UrlField,
  color: ColorField,
  boolean: BooleanField,
  image: ImageField,
  date: DateField,
};
