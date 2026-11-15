import type { IBlockPropertyNumber } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import NumberField from "./number-field.vue";

const rating: IBlockPropertyNumber = {
  id: 4,
  type: "number",
  label: "Rating",
  hint: "Stars out of five",
  min: 1,
  max: 5,
  step: 1,
  defaultValue: null,
};

/**
 * Clearing a `type="number"` input hands the model an empty string, so the field can hold a value its
 * own type says it cannot. The stepper writes what it computes back, so it has to survive that value:
 * `"" + 1` is the string `"1"`, which passes the range check and is stored as text.
 */
const cleared = "" as unknown as number;

function wrapperOf(modelValue?: number) {
  return mount(NumberField, { props: { field: rating, id: "field-0", modelValue } });
}

function steppersOf(modelValue?: number) {
  const wrapper = wrapperOf(modelValue);
  const [down, up] = wrapper.findAll("button");

  return { wrapper, down: down!, up: up! };
}

describe("NumberField stepper", () => {
  it("steps a cleared field to the field's minimum as a number", async () => {
    const { wrapper, up } = steppersOf(cleared);
    await up.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([1]);
  });

  it("steps a field that was never set to the minimum as a number", async () => {
    const { wrapper, up } = steppersOf();
    await up.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([1]);
  });

  it("stores a whole number when it steps a stored value", async () => {
    const { wrapper, up } = steppersOf(2);
    await up.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([3]);
  });

  it("steps down a stored value", async () => {
    const { wrapper, down } = steppersOf(3);
    await down.trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2]);
  });

  it("writes nothing when a step would leave the range the field offers", async () => {
    const { wrapper, up } = steppersOf(5);
    await up.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
