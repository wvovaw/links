import type { BlockPropertyType } from "@links/blocks";
import type { Component } from "vue";

import ListField from "./list-field.vue";
import { scalarFields } from "./scalars";

/**
 * Which component renders which property type. The record is keyed by `BlockPropertyType`, so adding a
 * type without a field is a compile error rather than a blank control in the editor — that is what
 * `pnpm --filter @links/web typecheck` guards.
 */
export const fieldsMap: Record<BlockPropertyType, Component> = { ...scalarFields, list: ListField };
