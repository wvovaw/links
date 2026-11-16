import { blocksList } from "@links/blocks";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";

import { useConstructorStore } from "../model";
import { CONSTRUCTOR_INJECTION_KEY } from "../model/provider";
import Workspace from "../ui/workspace/workspace.vue";

/* The palette lives in a sheet, which reka renders into `document.body` rather than the wrapper. */
function paletteItems() {
  return [...document.body.querySelectorAll<HTMLElement>("[data-testid='blocks-list-item']")];
}

describe("constructor block palette", () => {
  it("inserts the picked block into the gap that was clicked", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useConstructorStore();
    store.blocks.length = 0;
    store.addBlock("Avatar");
    const selectView = vi.fn();

    const wrapper = mount(Workspace, {
      attachTo: document.body,
      global: {
        plugins: [pinia],
        provide: { [CONSTRUCTOR_INJECTION_KEY]: { isMobile: ref(false), selectView } },
      },
    });

    /* The first marker sits above the only block, so its pick must land at index 0. */
    await wrapper.get("[data-testid='insert-block']").trigger("click");
    expect(paletteItems().length).toBeGreaterThan(0);

    paletteItems()[0]!.click();
    await nextTick();

    expect(store.blocks.map((block) => block.name)).toEqual([blocksList[0]?.name, "Avatar"]);
    expect(store.selectedBlockId).toBe(store.blocks[0]?.id);
    expect(selectView).toHaveBeenCalledWith("blocks");

    wrapper.unmount();
  });
});
