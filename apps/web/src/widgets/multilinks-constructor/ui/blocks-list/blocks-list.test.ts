import type { VueWrapper } from "@vue/test-utils";

import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useConstructorStore } from "../../model";
import BlocksList from "./blocks-list.vue";

describe("testing BlocksList component", () => {
  let wrapper: VueWrapper;
  beforeEach(() => {
    wrapper = mount(BlocksList, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("can add a block on click", async () => {
    await wrapper.find("[data-testid='blocks-list-item']").trigger("click");
    const store = useConstructorStore();
    expect(store.blocks.length).toBeGreaterThan(0);
    expect(store.selectedBlockId).toBe(store.blocks[0].id);
  });
});
