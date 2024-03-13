import type { UIRadioItemVariants } from "../RadioItem";

export const RADIO_GROUP_INJECTION_KEY = Symbol("RadioGroupInjectionKey") as InjectionKey<{
  color: UIRadioItemVariants["color"];
  disabled: boolean;
}>;
