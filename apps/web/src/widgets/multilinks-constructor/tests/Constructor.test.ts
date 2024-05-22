import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import PageEditor from "../MultilinksConstructor.vue";

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
