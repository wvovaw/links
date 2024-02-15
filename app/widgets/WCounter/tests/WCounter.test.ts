import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import WCounter from "../WCounter.vue";

/**
 * WCounter.vue component-test example with @nuxt/test-utils
 */
describe("increment and decrement", () => {
  const wrapper = mount(WCounter, { props: { initial: -4 } });
  const counter = wrapper.get("[data-test='counter']");
  const btns = wrapper.findAll("button");
  const [incBtn, decBtn] = btns;

  it("-4 should become -3 after increment", async () => {
    expect(counter.html()).toContain("-4");
    await incBtn.trigger("click");
    expect(counter.html()).toContain("-3");
  });
  it("-3 should become -4 after decrement", async () => {
    expect(counter.html()).toContain("-3");
    await decBtn.trigger("click");
    expect(counter.html()).toContain("-4");
  });
});
