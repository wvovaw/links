import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ThemeButton from "./theme-button.vue";
import ThemeInput from "./theme-input.vue";
import ThemeLabel from "./theme-label.vue";
import ThemeTextarea from "./theme-textarea.vue";

describe("ThemeInput", () => {
  it("draws a native input with the type, id and placeholder it was given", () => {
    const wrapper = mount(ThemeInput, {
      props: { id: "email", type: "email", placeholder: "you@example.com", required: true },
    });
    const input = wrapper.get("input");

    expect(input.attributes("id")).toBe("email");
    expect(input.attributes("type")).toBe("email");
    expect(input.attributes("placeholder")).toBe("you@example.com");
    expect(input.attributes("required")).toBeDefined();
  });

  it("writes back what the visitor types", async () => {
    const wrapper = mount(ThemeInput);

    await wrapper.get("input").setValue("ada@example.com");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["ada@example.com"]);
  });
});

describe("ThemeTextarea", () => {
  it("draws a native textarea with its rows", () => {
    const wrapper = mount(ThemeTextarea, { props: { id: "message", rows: 4 } });
    const textarea = wrapper.get("textarea");

    expect(textarea.attributes("id")).toBe("message");
    expect(textarea.attributes("rows")).toBe("4");
  });

  it("writes back what the visitor types", async () => {
    const wrapper = mount(ThemeTextarea);

    await wrapper.get("textarea").setValue("Hello there");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["Hello there"]);
  });
});

describe("ThemeButton", () => {
  it("submits by default and keeps the slot as its label", () => {
    const wrapper = mount(ThemeButton, { slots: { default: "Send" } });

    expect(wrapper.get("button").attributes("type")).toBe("submit");
    expect(wrapper.get("button").text()).toBe("Send");
  });

  it("is disabled while it is loading", () => {
    const wrapper = mount(ThemeButton, { props: { loading: true } });

    expect(wrapper.get("button").attributes("disabled")).toBeDefined();
    expect(wrapper.get("button").attributes("aria-busy")).toBe("true");
  });
});

describe("ThemeLabel", () => {
  it("points at its control", () => {
    const wrapper = mount(ThemeLabel, { props: { htmlFor: "email" }, slots: { default: "Email" } });

    expect(wrapper.get("label").attributes("for")).toBe("email");
    expect(wrapper.get("label").text()).toBe("Email");
  });
});
