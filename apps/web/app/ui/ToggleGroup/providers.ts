import type { ToggleVariants } from "../Toggle/private/ToggleItem.vue";

export const TOGGLE_GROUP_INJECTION_KEY = Symbol("ToggleGroupInjectionKey") as InjectionKey<{
  variant: ToggleVariants["variant"];
  color: ToggleVariants["color"];
  size: ToggleVariants["size"];
  withStroke: boolean;
  disabled: boolean;
}>;
