import { beforeEach, describe, expect, it } from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import BlocksList from "./blocks-list.vue";

describe("testing BlocksList component", () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(BlocksList);
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("can emit 'addBlock' event", () => {
    wrapper.find("[data-testid='blocks-list-item']").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("addBlock");
  });
});
