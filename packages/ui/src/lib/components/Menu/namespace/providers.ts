import type { AcceptableValue, ToggleGroupRootProps } from "reka-ui";
import type { InjectionKey, Ref } from "vue";

type ModelValue = ToggleGroupRootProps["modelValue"];

export const menuItemKey = Symbol("MenuItemContext") as InjectionKey<{
  value: Ref<AcceptableValue>;
  disabled: Ref<boolean>;
}>;

export const menuItemsGroupKey = Symbol("MenuItemsGroupContext") as InjectionKey<{
  modelValue: Ref<ModelValue>;
}>;
