import type { InjectionKey } from "vue";
import type { ToggleGroupRootProps } from "radix-vue";

type ModelValue = ToggleGroupRootProps["modelValue"];

export const menuItemKey = Symbol("MenuItemContext") as InjectionKey<{
  value: Ref<string>;
  disabled: Ref<boolean>;
}>;

export const menuItemsGroupKey = Symbol("MenuItemsGroupContext") as InjectionKey<{
  modelValue: Ref<ModelValue>;
}>;
