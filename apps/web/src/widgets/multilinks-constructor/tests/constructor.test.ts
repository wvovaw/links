import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import PageEditor from "../multilinks-constructor.vue";

describe("testing PageEditor widget", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  // const constructorStore = useConstructorStore(pinia);

  const wrapper = mount(PageEditor, {
    global: {
      plugins: [pinia],
    },
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });
});
