import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import PageEditor from "../Constructor.vue";
import { usePageStore } from "../model";
import { createBlock } from "../core";

describe("testing PageEditor widget", () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const pageStore = usePageStore(pinia);

  const wrapper = mount(PageEditor, {
    global: {
      plugins: [pinia],
    },
  });

  it("can mount", () => {
    expect(wrapper.vm).toBeTruthy();
  });

  it("can add a block on a page", async () => {
    const addBlockBtn = wrapper.find("[data-testid='blocks-list-item']");
    await addBlockBtn.trigger("click");
    expect(pageStore.addBlock).toHaveBeenCalledTimes(1);
  });

  it("can render block from the store", async () => {
    const buttonBlock = createBlock("Button", "1");
    pageStore.$patch({
      page: {
        id: "0",
        title: "title",
        blocks: [buttonBlock],
      },
    });

    // await flushPromises();
    const pageBlock = wrapper.find("[data-testid='page-block']");
    console.log(wrapper.html());
    await pageBlock.trigger("click");
  });
});
