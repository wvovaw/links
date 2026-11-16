import type { Pinia } from "pinia";

import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { ref } from "vue";

import { useConstructorStore } from "../model";
import { CONSTRUCTOR_INJECTION_KEY } from "../model/provider";
import PageRenderer from "../ui/workspace/page-renderer.vue";

/* The selected block renders its action bar, which reads the constructor's context. */
function constructorContext() {
  return { [CONSTRUCTOR_INJECTION_KEY]: { isMobile: ref(false) } };
}

describe("constructor page insertion points", () => {
  let pinia: Pinia;
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    const store = useConstructorStore();
    /* The state array is module-level and mutated in place, so it carries blocks between tests. */
    store.blocks.length = 0;
    store.addBlock("Avatar");
    store.addBlock("Paragraph");
    wrapper = mount(PageRenderer, { global: { plugins: [pinia], provide: constructorContext() } });
  });

  /* A marker rendered as a sibling would become a drag node: the drag root holds blocks only. */
  it("keeps the drag nodes to the blocks and adds one point per gap", () => {
    expect(wrapper.findAll(".link__blocks-root > *")).toHaveLength(2);
    expect(wrapper.findAll("[data-testid='insert-block']")).toHaveLength(3);
  });

  it("forwards the index of the clicked gap", async () => {
    const gaps = wrapper.findAll("[data-testid='insert-block']");

    await gaps[1]!.trigger("click");
    await gaps[2]!.trigger("click");

    expect(wrapper.emitted("insert")).toEqual([[1], [2]]);
  });

  it("offers the first block on an empty page", async () => {
    useConstructorStore().blocks.length = 0;

    const empty = mount(PageRenderer, { global: { plugins: [pinia], provide: constructorContext() } });
    await empty.get("[data-testid='empty-page-add-block']").trigger("click");

    expect(empty.emitted("insert")).toEqual([[0]]);
  });
});
