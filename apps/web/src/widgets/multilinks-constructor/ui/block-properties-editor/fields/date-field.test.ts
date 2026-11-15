import type { IBlockPropertyDate } from "@links/blocks";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import DateField from "./date-field.vue";

const instant: IBlockPropertyDate = {
  id: 0,
  type: "date",
  label: "Target date",
  withTime: true,
  defaultValue: null,
};

const calendarDate: IBlockPropertyDate = { ...instant, withTime: false };

function wrapperOf(field: IBlockPropertyDate, modelValue?: string) {
  return mount(DateField, { props: { field, id: "field-0", modelValue } });
}

function inputOf(field: IBlockPropertyDate, modelValue?: string) {
  return wrapperOf(field, modelValue).get("input");
}

describe("DateField", () => {
  it("offers a date and a time when the property asks for an instant", () => {
    expect(inputOf(instant, "2026-12-01T18:30:00.000Z").attributes("type")).toBe("datetime-local");
  });

  it("offers a bare date for a calendar date", () => {
    expect(inputOf(calendarDate, "2026-12-01T00:00:00.000Z").attributes("type")).toBe("date");
  });

  it("shows a stored instant in the browser's own timezone", () => {
    const stored = "2026-12-01T18:30:00.000Z";
    const local = new Date(stored);
    const pad = (value: number) => String(value).padStart(2, "0");
    const expected = `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`;

    expect(inputOf(instant, stored).element.value).toBe(expected);
  });

  it("keeps the calendar date a stored date carries", () => {
    expect(inputOf(calendarDate, "2026-12-01T00:00:00.000Z").element.value).toBe("2026-12-01");
  });

  it("leaves the picker empty for no value and for a value it cannot read", () => {
    expect(inputOf(instant).element.value).toBe("");
    expect(inputOf(instant, "nonsense").element.value).toBe("");
  });

  it("writes a picked time back as an ISO instant", async () => {
    const wrapper = wrapperOf(instant);
    await wrapper.get("input").setValue("2026-12-01T18:30");

    expect(wrapper.get("input").element.value).toBe("2026-12-01T18:30");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([new Date("2026-12-01T18:30").toISOString()]);
  });

  it("writes a picked calendar date back as UTC midnight", async () => {
    const wrapper = wrapperOf(calendarDate);
    await wrapper.get("input").setValue("2026-12-02");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["2026-12-02T00:00:00.000Z"]);
  });

  it("clears the stored value when the picker is emptied", async () => {
    const wrapper = wrapperOf(instant, "2026-12-01T18:30:00.000Z");
    await wrapper.get("input").setValue("");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([undefined]);
  });
});
